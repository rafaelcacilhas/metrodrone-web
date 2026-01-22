// Simple instrument: 2 voices and basic effects
export default class Cello{
    private started = false;

    private audioContext:AudioContext;
    private output: GainNode;
    private baseOscillator: OscillatorNode;
    private detunedOscillator: OscillatorNode;
    private filter: BiquadFilterNode;
    private lfo: OscillatorNode;
    private lfoGain: GainNode;

    private detunedOscillatorValue = 1.005;

    /*
        Oscillators (sawtooth) → Filter (lowpass) → Output (Gain)
                ↑
        LFO → Gain (depth) → Oscillator frequency (vibrato)
    */

    constructor(audioContext: AudioContext, baseFrequency: number, volume:number){
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.gain.value = volume;

        this.baseOscillator = audioContext.createOscillator();
        this.baseOscillator.type = 'sawtooth';
        this.baseOscillator.frequency.value = baseFrequency;

        this.detunedOscillator = audioContext.createOscillator();
        this.detunedOscillator.type = 'sawtooth';
        this.detunedOscillator.frequency.value = baseFrequency * this.detunedOscillatorValue;

        this.filter = audioContext.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 1200;
        this.filter.Q.value = 1.5;

        this.baseOscillator.connect(this.filter);
        this.detunedOscillator.connect(this.filter);
        this.filter.connect(this.output);

        this.lfo = audioContext.createOscillator();
        this.lfoGain = audioContext.createGain();
        this.lfo.frequency.value = 5; // 5 Hz vibrato
        this.lfoGain.gain.value = 2; 

        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.baseOscillator.frequency);
        this.lfoGain.connect(this.detunedOscillator.frequency);
    }

    start(time?:number){
        if(this.started) return;
        this.started = true;

        this.baseOscillator.start(time);
        this.detunedOscillator.start(time);
        this.lfo.start(time);
    }

  stop(time?: number) {
        if(!this.started) return;
        this.started = false;

        const stopTime = time || this.audioContext.currentTime + 0.1;
        this.output.gain.exponentialRampToValueAtTime(0.001, stopTime);
        this.baseOscillator.stop(stopTime);
        this.detunedOscillator.stop(stopTime);
    }

    setFrequency(frequency: number, time?:number){
        this.baseOscillator.frequency.setValueAtTime(frequency, time || 0)
        this.detunedOscillator.frequency.setValueAtTime(frequency*this.detunedOscillatorValue, time || 0)
    }

    connect(){
        this.output.connect(this.audioContext.destination);
    }

    disconnect(){
        this.output.disconnect(this.audioContext.destination);
    }

}