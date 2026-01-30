
export class HighPassFilter {
    private audioContext:AudioContext;
    public frequency: number;
    public q:number;
    public node: BiquadFilterNode;

    constructor(audioContext:AudioContext, frequency: number, q:number){
        this.audioContext = audioContext;
        this.frequency = frequency;
        this.q = q;

        this.node = this.audioContext.createBiquadFilter();
        this.node.type = 'highpass';
        this.node.frequency.value = this.frequency;
        this.node.Q.value = this.q;
    }

    connect(destination: GainNode){
        this.node.connect(destination);
    }

    setFrequency(number:number){
        this.frequency = number;  
    }

    setQ(number:number){
        this.q = number;
    }

}
