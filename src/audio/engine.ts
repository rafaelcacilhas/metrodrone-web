import DroneInstrument from "./droneInstrument";
import type { DroneInstrumentProps } from "./droneInstrument";
import MetronomeScheduler from "./metronomeScheduler";
import type {MetronomeSchedulerProps} from './metronomeScheduler';

type AudioEngineConfig = {   
    volume: number;
    droneFrequency:number;
    waveType: OscillatorType;
    numberOfBeats: number;
    tempo: number;
}

export default class AudioEngine {
    public volume:number;
    public droneFrequency:number;
    public waveType:OscillatorType;

    private context:AudioContext;
    private drone : DroneInstrument | null;
    private isDroneActive: boolean = false;
    private droneProperties: DroneInstrumentProps;
    
    private metronome: MetronomeScheduler | null;
    private isMetronomeActive: boolean = false;
    private metronomeProperties: MetronomeSchedulerProps;

    constructor(config: AudioEngineConfig) {
        this.context = new AudioContext;
        this.volume = config.volume;
        this.droneFrequency = config.droneFrequency;
        this.waveType = config.waveType;

        this.droneProperties = {
            audioContext: this.context,
            waveType: config.waveType,
        }
        this.drone = new DroneInstrument(this.droneProperties);

        this.metronomeProperties = {
            audioContext: this.context,
            numberOfBeats: config.numberOfBeats,
            tempo: config.tempo,
        }
        this.metronome = new MetronomeScheduler(this.metronomeProperties);
    }

    playDrone: () => void = () =>{
        if(this.isDroneActive) return;
        this.drone = new DroneInstrument(this.droneProperties);
        this.drone.setDroneFrequency(this.droneFrequency);
        this.drone.play();
        this.isDroneActive = true;
    };

    stopDrone: () => void = () =>{
        if(!this.isDroneActive || !this.drone) return;
        this.drone.stop();
        this.drone = null;
        this.isDroneActive = false;
    }

    setDroneFrequency: (frequency: number) => void = (frequency) =>{
        this.droneFrequency = frequency;
        if(this.isDroneActive) {
            this.stopDrone();
            this.playDrone();
        }
    }

    playMetronome: () => void = () =>{
        if(this.isMetronomeActive) return;
        this.metronome = new MetronomeScheduler(this.metronomeProperties);
        this.metronome.setShouldPlay(true);
        this.metronome.play();
        this.isMetronomeActive = true;
    }   

    stopMetronome: () => void = () => {
        if(!this.metronome || !this.isMetronomeActive ) return;
        this.metronome.stop();
        this.metronome = null;
        this.isMetronomeActive = false;
    }
    
    setTempo: ( newTempo: number) => void = (newTempo) => {
        this.metronomeProperties.tempo = newTempo;
        if(this.isMetronomeActive) {
            this.stopMetronome();
            this.playMetronome();
        }
    }

    setNumberOfBeats: ( newNumber: number) => void = (newNumber) => {
        this.metronomeProperties.numberOfBeats = newNumber;
        if(this.isMetronomeActive) {
            this.stopMetronome();
            this.playMetronome();
        }
    }

    dispose: () => void = () =>{
        this.stopDrone  ();
        this.context.close();
    }
}


/*
    Input -> Effects -> Destination
    
    1 - Create audio context
    2 - Create sources — such as <audio>, oscillator, stream
    3 - Create effects nodes, such as reverb, biquad filter, panner, compressor
    4 - Choose final destination of audio
    5 - Connect the sources up to the effects, and the effects to the destination.
*/