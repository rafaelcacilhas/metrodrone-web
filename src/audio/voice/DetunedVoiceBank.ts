export class DetunedVoiceBank {
    public node: GainNode;
    private audioContext: AudioContext;
    private baseFrequency: number;
    private voiceCount: number;
    private detuneSpread: number;
    private voices: OscillatorNode[] = [];

    private isRunning: Boolean = false;

    constructor(audioContext:AudioContext, baseFrequency:number, voiceCount:number, detuneSpread:number){
        this.audioContext = audioContext;
        this.baseFrequency = baseFrequency;
        this.voiceCount = voiceCount;
        this.detuneSpread = detuneSpread;

        this.node = new GainNode(this.audioContext); 
        this.voices = this.createDetunedVoices();
    }

    createDetunedVoices(){
        const voices: OscillatorNode[] = []
        for(let i = 0; i < this.voiceCount; i++){
            const frequencyInterval =  2.0*this.baseFrequency*this.detuneSpread/this.voiceCount // Ramps linearly from baseFrequency - detuneSpread% to baseFrequency + detunedSpread% 
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = this.baseFrequency + (i-this.voiceCount/2)*frequencyInterval;

            voices.push(oscillator)
        }
        return voices;
    }

    start(time?:number){
        if(this.isRunning) return;
        this.voices.forEach((voice) => {
            voice.start(time);
            voice.connect(this.node)
        })
        this.isRunning = true;
    }

    stop(time?:number) {
        if(!this.isRunning) return;
        this.voices.forEach(voice =>{
             voice.stop(time);
             voice.disconnect();
        })
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

    disconnect(destination:AudioNode){
        this.node.disconnect(destination);
    }

    setFrequency(newFrequency: number){
        this.baseFrequency = newFrequency;
        this.restart();
    }

    setNumberOfVoices(number:number){
        this.voiceCount = number;
        this.restart();
    }

    setVoiceSpread(number:number){
        this.detuneSpread = number;
        this.restart();
    }
}
