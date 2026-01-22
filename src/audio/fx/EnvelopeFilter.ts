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

    // private attackTime: number;
    // private releaseTime: number;

    constructor(audioContext:AudioContext, envelopeParameters: EnvelopeParameters){
        this.audioContext = audioContext;
        this.attack = envelopeParameters.attack;
        this.release = envelopeParameters.release;
        this.decay = envelopeParameters.decay;
        this.sustain = envelopeParameters.sustain;

        this.node = this.audioContext.createGain();
    }

    start(time?:number){

    }

    stop(time?:number){

    }

    setAttack(t: number){

    };
    setDecay(t: number){
        
    };
    setSustain(l: number){
        
    };
    setRelease(t: number){
        
    };
    triggerAttack(time: number){
        
    };
    triggerRelease(time: number){
        
    };
}