export type EnvelopeParameters = {
    attack:number;
    sustain: number;
    decay: number;
    release:number;
}
export class EnvelopeFilter{

    private audioContext:AudioContext;
    public node: GainNode;

    private attack: number = 0.1;
    private decay: number = 0.3;
    private sustain: number = 0.5;
    private release: number = 0.2;

    private releaseTime: number = 0;
    private isActive: boolean = false;

    constructor(audioContext:AudioContext, envelopeParameters: EnvelopeParameters){
        this.audioContext = audioContext;
        this.attack = envelopeParameters.attack;
        this.release = envelopeParameters.release;
        this.decay = envelopeParameters.decay;
        this.sustain = envelopeParameters.sustain;

        this.node = this.audioContext.createGain();
        this.node.gain.value = 0.5;
    }

    start(time?:number){

    }

    stop(time?:number){

    }

    dispose(){
        this.node.disconnect();
    }

    setAttack(attack: number){
        this.attack = Math.max(0.001, attack);
    };
    setDecay(decay: number){
        this.decay =  Math.max(0.001, decay);
    };
    setSustain(sustain: number){
        this.sustain =  Math.max(0.001, sustain);
    };
    setRelease(release: number){
        this.release =  Math.max(0.001, release);
    };

    triggerAttack(time: number){
        this.isActive = true;
        const t = time;
        this.node.gain.cancelScheduledValues(t);

        this.node.gain.setValueAtTime(0.001,t);
        this.node.gain.exponentialRampToValueAtTime(1, t+this.attack);

        this.node.gain.setTargetAtTime(this.sustain, t + this.attack,this.decay);
    };

    triggerRelease(time: number){
        if(!this.isActive) return;
        this.isActive = false;
        this.releaseTime = time;

        this.node.gain.cancelScheduledValues(time);
        this.node.gain.setValueAtTime(this.node.gain.value, time);
        this.node.gain.setTargetAtTime(0.001, time, this.release);
    };
}