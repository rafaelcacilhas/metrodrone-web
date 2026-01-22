import Cello from './sounds/Cello';
import { StringEnsemble } from './sounds/Strings';

export type DroneInstrumentProps = {
    audioContext: AudioContext;
    waveType: OscillatorType;
    frequency: number;
    volume:number;
}

export default class Drone {
    public audioContext: AudioContext;

    private instrument:StringEnsemble;
    public waveType: OscillatorType; // TODO: Cleanup this, not used
    public frequency: number;
    public volume: number;

    constructor(config: DroneInstrumentProps){
        this.audioContext = config.audioContext;
        this.waveType = config.waveType;
        this.frequency = config.frequency;
        this.volume = config.volume;

        this.instrument = this.createNewInstrument();
    } 

    createNewInstrument: () => StringEnsemble = () => {
        const instrument = new StringEnsemble(this.audioContext, this.frequency);
        instrument.connect(this.audioContext.destination);
        return instrument;
    }

    play: () => void = () =>{
        if(!this.instrument) this.instrument = this.createNewInstrument();
        this.instrument.start();
    };

    stop: () => void = () =>{
        if(!this.instrument) return;
        this.instrument.stop();
        this.instrument.disconnect();
    }

    setDroneFrequency: (frequency: number) => void = (frequency) => {
        if(!this.instrument) return
        this.instrument.setFrequency(frequency);
    }
}