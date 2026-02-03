import { LowPassFilter } from "../fx/LowPassFilter";
import { HighPassFilter } from "../fx/HighPassFilter";
import { EnvelopeFilter, type EnvelopeParameters } from "../fx/EnvelopeFilter";

export class DrumSynth {
    public node: GainNode;
    private audioContext: AudioContext;
    private baseFrequency: number;
    private audioBuffer: AudioBuffer;
    private isRunning: Boolean = false;   

    constructor(audioContext:AudioContext, baseFrequency:number){
        this.audioContext = audioContext;
        this.baseFrequency = baseFrequency;
        this.audioBuffer = this.createNoiseBuffer(0.5);
        this.node = this.audioContext.createGain(); 
        this.node.gain.value = 0.4;

        this.node.connect(this.audioContext.destination);
    }

    createNoiseBuffer(duration:number){
        const buffer:AudioBuffer = this.audioContext?.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < data.length; i++){
            data[i] = Math.random()*2 - 1;
        }
        return buffer
    }

    // Oscillator -> Envelope -> Node
    playKick(time: number, duration: number = 1):void{
        const oscilator = this.audioContext.createOscillator();
        oscilator.frequency.setValueAtTime(this.baseFrequency, time);
        oscilator.frequency.exponentialRampToValueAtTime(0.001, time+duration);

        let envelopeParams:EnvelopeParameters = {
            attack: 0.01,
            decay: 0.3,
            sustain: 0,
            release: 0.1,
        }
        const envelope = new EnvelopeFilter(this.audioContext, envelopeParams);
        oscilator.connect(envelope.node);
        envelope.node.connect(this.node)

        envelope.triggerAttack(time);
        oscilator.start(time);
        oscilator.stop(time+duration);
    }

    // Noise -> Lowpass -> Mix -> Envelope -> Node
    playSnare(time: number, duration: number = 0.3):void{
        const noiseBuffer = this.audioContext.createBufferSource();
        noiseBuffer.buffer = this.createNoiseBuffer(duration);
        noiseBuffer.loop = true;

        const filter = new LowPassFilter(this.audioContext,2000,1);
        noiseBuffer.connect(filter.node);

        const mix = this.audioContext.createGain();
        mix.gain.value = 0.2;
        filter.node.connect(mix);

        const tone = this.audioContext.createOscillator();
        tone.frequency.setValueAtTime(180,time);
        tone.frequency.exponentialRampToValueAtTime(0.001, time+duration*0.5);

        tone.connect(mix);

        let envelopeParams:EnvelopeParameters = {
            attack: 0.01,
            decay: 0.3,
            sustain: 0,
            release: 0.1,
        }
        const envelope = new EnvelopeFilter(this.audioContext, envelopeParams);
        mix.connect(envelope.node);

        envelope.node.connect(this.node)
        envelope.triggerAttack(time);
        noiseBuffer.start(time);
        tone.start(time);
        noiseBuffer.stop(time+duration);
        tone.stop(time+duration);
    }

    // noise -> highpass -> mix -> envelope -> node
    playHihat(time: number, duration: number = 0.3):void{
        const noiseBuffer = this.audioContext.createBufferSource();
        noiseBuffer.buffer = this.createNoiseBuffer(duration);
        noiseBuffer.loop = true;

        const filter = new HighPassFilter(this.audioContext,7000,0.5);
        noiseBuffer.connect(filter.node);

        const mix = this.audioContext.createGain();
        mix.gain.value = 0.02;
        filter.node.connect(mix);

        let envelopeParams:EnvelopeParameters = {
            attack: 0.01,
            decay: 0.3,
            sustain: 0,
            release: 0.1,
        }
        const envelope = new EnvelopeFilter(this.audioContext, envelopeParams);
        
        mix.connect(envelope.node);
        envelope.node.connect(this.audioContext.destination);
        
        envelope.triggerAttack(time);
        noiseBuffer.start(time);
        noiseBuffer.stop(time+duration);
    }

    start(time?:number){
        if(this.isRunning) return;
        this.isRunning = true;
    }

    stop(time?:number) {
        if(!this.isRunning) return;
        this.isRunning = false;
    }

    restart(){
        if(this.isRunning){
            this.stop();
            this.start();
        }
    }

    connect(destination:AudioNode){
        this.node.connect(destination);
    }

    disconnect(){
        this.node.disconnect();
    }

    setFrequency(newFrequency: number){
        this.baseFrequency = newFrequency;
        this.restart();
    }
}
