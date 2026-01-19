export type DroneInstrumentProps = {
    audioContext: AudioContext;
    waveType: OscillatorType;
}

export default class DroneInstrument {
    public audioContext: AudioContext;

    private oscillator: OscillatorNode | null = null;
    public waveType: OscillatorType;

    constructor(config: DroneInstrumentProps){
        this.audioContext = config.audioContext;
        this.waveType = config.waveType;

        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = this.waveType;

        this.oscillator.connect(this.audioContext.destination);
    }

    play: () => void = () =>{
        if(!this.oscillator) return;
        this.oscillator.start();
    };

    stop: () => void = () =>{
        if(!this.oscillator) return;

        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
    }

    setDroneFrequency: (frequency: number) => void = (frequency) => {
        if(!this.oscillator) return
        this.oscillator.frequency.value = frequency;
    }
}