
export class LowPassFilter {
    private audioContext:AudioContext;
    public frequency: number;
    public q:number;
    public node: BiquadFilterNode;

    constructor(audioContext:AudioContext, frequency: number, q:number){
        this.audioContext = audioContext;
        this.frequency = frequency;
        this.q = q;

        this.node = this.audioContext.createBiquadFilter();
        this.node.type = 'lowpass';
        this.node.frequency.value = this.frequency;
        this.node.Q.value = this.q;
    }

    setFrequency(number:number){
        this.frequency = number;  
    }

    setQ(number:number){
        this.q = number;
    }

}
