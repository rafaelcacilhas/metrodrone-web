
import type { BeatSounds } from "src/stores/audio";
import { audioContextUtil } from "../../utils/audio-context";
import DroneEngine from "./DroneEngine";
import MetronomeEngine from "./MetronomeEngine"; 

export type BaseEngineProps = {
    audioContext: AudioContext;
    numberOfBeats:number;
    baseFrequency:number;
    tempo:number;
    volume:number;
    onBeatChange:(beat:number)=>void;
}

export default class BaseEngine {
    protected audioContext: AudioContext;
    public droneEngine: DroneEngine | null = null;
    public metronomeEngine: MetronomeEngine | null = null;

    private metronomeProperties;

    private isDroneActive: boolean = false;
    private isMetronomeActive:boolean = false;

    constructor(config: BaseEngineProps){
        this.audioContext = audioContextUtil.getContext();

        this.metronomeProperties = {
            audioContext: this.audioContext, //this.audioContext
            numberOfBeats: config.numberOfBeats,
            tempo: config.tempo,
            baseFrequency: config.baseFrequency,
            onBeatChange: config.onBeatChange,
        }

        this.metronomeEngine = new MetronomeEngine(this.metronomeProperties);

        const droneProperties = {
            audioContext: this.audioContext,
            waveType: 'sawtooth' as OscillatorType,
            volume: config.volume,
            frequency: config.baseFrequency,
        }

        this.droneEngine = new DroneEngine(droneProperties);
    } 

    async playDrone():Promise<void>{
        if(this.isDroneActive) return;

        await audioContextUtil.ensureRunning();
        this.droneEngine?.play();
        this.isDroneActive = true;
    }

    async playMetronome():Promise<void>{
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

    updateMetronome(params:{
        tempo?:number;
        numberOfBeats?:number;
        beatSounds?:BeatSounds[];
    }):void{
        const wasPlaying = this.isMetronomeActive;
        if(wasPlaying){
            this.stopMetronome();
        }

        this.metronomeEngine?.updateParams(params);

        if(wasPlaying){
            this.playMetronome();
        }
    }

}