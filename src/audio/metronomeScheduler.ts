import {currentBeat, numberOfBeats} from '../stores/audio'

export type MetronomeSchedulerProps = { 
    audioContext: AudioContext;
    numberOfBeats: number;
    tempo: number,
}

export default class MetronomeScheduler{
    public audioContext: AudioContext;
    public numberOfBeats: number;
    public tempo: number;
    public currentBeat: number = 1;

    private oscillator: OscillatorNode | null = null;
    private beatDuration: number;
    private noteDuration: number;
    private nextBeatTime: number;
    private timeoutId : number = 0;
    private shouldPlay : boolean = false;

    constructor(config:MetronomeSchedulerProps){
        this.audioContext = config.audioContext
        this.numberOfBeats = config.numberOfBeats;

        this.tempo = config.tempo;
        this.beatDuration = 60.0/this.tempo;
        this.noteDuration = Math.min(0.3, this.beatDuration/3)

        this.nextBeatTime = this.audioContext.currentTime + this.beatDuration;
    }

    play: () => void = () =>{
        if(this.audioContext.state != "running") this.audioContext.resume();

        const scheduleNext = () => {
            if(!this.shouldPlay) return;
            const now = this.audioContext.currentTime;
            if (now >= this.nextBeatTime ) { 
                this.singleBeep(this.nextBeatTime);
                this.nextBeatTime += this.beatDuration;
                
                currentBeat.update((lastValue) => {
                    if(lastValue == this.numberOfBeats) return 1;
                    else return lastValue + 1
                })
            }

            const timeUntilNext = this.nextBeatTime - now;
            this.timeoutId = setTimeout(scheduleNext, timeUntilNext * 1000 );
        };

        this.nextBeatTime = this.audioContext.currentTime;
        scheduleNext();
    };

    singleBeep: (startTime: number) => void = (startTime)  => {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.connect(this.audioContext.destination);

        this.oscillator.start(startTime);
        this.oscillator.stop(startTime + this.noteDuration);

        this.oscillator = null;

    }

    stop: ( ) => void = () =>{
        this.oscillator = null;
        this.timeoutId = 0;
        this.shouldPlay = false;
    }

    setShouldPlay: (value: boolean) => void = (value) => {
        this.shouldPlay = value;    
    }

    setTempo: (tempo: number) => void = (tempo) => {
        this.tempo = tempo;    
    }

    setCurrentBeat: (number: number) => void = (number) =>{
        
    }

}