
import { audioContextUtil } from "../../utils/audio-context";
import DroneEngine from "./DroneEngine";
import MetronomeEngine from "./MetronomeEngine"; 

export type BaseEngineProps = {
    audioContext: AudioContext;
    numberOfBeats:number;
    baseFrequency:number;
    tempo:number;
    volume:number;
}

export default class BaseEngine {
    protected audioContext: AudioContext;
    protected isPlaying:boolean = false;
    public droneEngine: DroneEngine | null = null;
    public metronomeEngine: MetronomeEngine | null = null;

    private metronomeProperties;

    private isDroneActive: boolean = false;
    private isMetronomeActive:boolean = false;
private metronomeInstanceId?: string;

    constructor(config: BaseEngineProps){
        this.audioContext = audioContextUtil.getContext();

        this.metronomeProperties = {
            audioContext: this.audioContext, //this.audioContext
            numberOfBeats: config.numberOfBeats,
            tempo: config.tempo,
            baseFrequency: config.baseFrequency,
            onBeatChange: (beat:number) => {
                // Update store here instead
                // You'll need to pass a callback from the store
            }
        }

        this.metronomeEngine = new MetronomeEngine(this.metronomeProperties);
        this.metronomeInstanceId = (this.metronomeEngine as any).instanceId; // Capture ID

        const droneProperties = {
            audioContext: this.audioContext,
            waveType: 'sawtooth' as OscillatorType,
            volume: config.volume,
            frequency: config.baseFrequency,
        }

        this.droneEngine = new DroneEngine(droneProperties);
    } 

    start: () => void = () =>{

    };

    stop: () => void = () =>{

    }

    dispose(){

    }

    async playDrone():Promise<void>{
        console.log("Engine drone")
        if(this.isDroneActive) return;

        await audioContextUtil.ensureRunning();
        this.droneEngine?.play();
        this.isDroneActive = true;
    }

    async playMetronome():Promise<void>{
        console.log('BaseEngine playing metronome instance:', this.metronomeInstanceId);
        if(this.isMetronomeActive) return;

        await audioContextUtil.ensureRunning();
        this.metronomeEngine?.play();
        this.isMetronomeActive = true;
    }

    stopDrone(){
        if(!this.isDroneActive) return;
        this.droneEngine?.stop();
        this.isDroneActive = false;
    }

    stopMetronome(){
        if(!this.isMetronomeActive) return;
        this.metronomeEngine?.stop();
        this.isMetronomeActive = false;
    }

    updateDroneFrequency(newFrequency: number){
        this.droneEngine?.setDroneFrequency(newFrequency)
        if(this.isDroneActive){
            this.stopDrone(); 
            this.playDrone();
        }
    }

}