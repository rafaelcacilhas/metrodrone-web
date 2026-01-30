import { Drums } from '../instruments/Drums';
import { audioContextUtil } from '../../utils/audio-context';

export enum BeatSounds {None, Kick, Snare, HiHat}

type BeatConfig = {
        sound: BeatSounds
}

export type MetronomeSchedulerProps = { 
    audioContext: AudioContext;
    numberOfBeats: number;
    tempo: number;
    baseFrequency: number;
    onBeatChange?:(beat:number) => void;
    beatSounds?: BeatSounds[];
}

export default class MetronomeEngine{ 
    public audioContext: AudioContext;
    private onBeatChange?:(beat:number) => void;
    public numberOfBeats: number;
    public tempo: number;
    public currentBeat: number = 0;

    private beatDuration: number;
    private nextBeatTime: number;
    private shouldPlay : boolean = false;

    private schedulerId: number | null = null;

    private drums:Drums| null;
    private baseFrequency:number;
    public beats: BeatSounds[] = [];  
    
    private isPlaying: boolean = false;
    private instanceId = Math.random().toString(36).substr(2, 9);

    
    constructor(config:MetronomeSchedulerProps){  
        // Core
        this.audioContext = config.audioContext;
        this.onBeatChange = config.onBeatChange;
        this.numberOfBeats = config.numberOfBeats;
        this.tempo = config.tempo;
        this.currentBeat = 0;
        this.baseFrequency = config.baseFrequency;

        // Timing
        this.beatDuration = 60.0/this.tempo;
        this.nextBeatTime = this.audioContext?.currentTime + this.beatDuration;
        this.beatDuration = Math.min(0.3, this.beatDuration/3.0)
        
        //Sound
        this.drums = new Drums(this.audioContext,config.baseFrequency, this.tempo)
        this.drums.connect(this.audioContext.destination);
        this.beats = config.beatSounds || Array(this.numberOfBeats + 1).fill(BeatSounds.Kick);

        // State
        this.isPlaying = false;
        this.schedulerId = null;
    }

    async play(){

        if(this.isPlaying) return;

        if (!this.drums) {
            this.drums = new Drums(this.audioContext, this.baseFrequency, this.tempo);
            this.drums.connect(this.audioContext.destination);
        }

        audioContextUtil.ensureRunning();
        this.isPlaying = true;
        this.currentBeat = 0;
        this.nextBeatTime = this.audioContext.currentTime + 0.1;

        this.startScheduler();
    }

    stop(){
        if(!this.isPlaying) return;
        this.isPlaying = false;
        if(this.schedulerId !== null){
            cancelAnimationFrame(this.schedulerId);
            this.schedulerId = null;
        }

        this.drums?.stop();
        this.currentBeat = 0;
    }

    dispose(){
            console.log(`[${this.instanceId}] dispose() called`);

        if(this.isPlaying) this.stop();
        if(this.drums){
            this.drums.dispose();
        }
        this.drums = null;
        this.onBeatChange = undefined;
        console.log("disposed", this.drums)
    }

    private scheduleNextBeats = ()=> {
        const currentTime = this.audioContext.currentTime;
        const scheduleAhead = 0.1;
        
        while(this.nextBeatTime < currentTime + scheduleAhead){
            this.scheduleSingleBeat(this.nextBeatTime);
            this.advanceToNextBeat();
        }

        if(this.isPlaying){
            this.schedulerId = requestAnimationFrame(this.scheduleNextBeats);
        }
    }

    startScheduler(){
        if(!this.isPlaying) return;
        console.log("playing tempo", this.tempo)
        this.schedulerId = requestAnimationFrame(this.scheduleNextBeats);
    }

    private scheduleSingleBeat(scheduleTime: number){
        const beatNumber = this.currentBeat + 1;
        const sound = this.beats[beatNumber]
        if(sound === BeatSounds.None || !sound){
            return;
        }

        this.drums?.start(scheduleTime, sound);
    }

    private advanceToNextBeat(): void{
        this.currentBeat= (this.currentBeat + 1) % this.numberOfBeats;
        this.nextBeatTime += this.beatDuration;
        if(this.onBeatChange){
            this.onBeatChange(this.currentBeat+1)
        }
    }

    updateParams(params:any){
        const wasPlaying = this.isPlaying;
        if(wasPlaying){
            this.stop();
        }
        if (this.schedulerId !== null) {
            cancelAnimationFrame(this.schedulerId);
            this.schedulerId = null;
        }
        this.dispose();
        if(params.tempo){
            console.log("update", params.tempo)
            this.tempo = params.tempo;
            console.log("noww", this.tempo)
            this.beatDuration = 60.0/this.tempo;
        }
        if(params.numberOfBeats){
            this.numberOfBeats = params.numberOfBeats;
            this.beats = Array(this.numberOfBeats + 1).fill(BeatSounds.Kick);
        }
        if(wasPlaying){
            this.play();
        }
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }
    
    getCurrentBeat(): number {
        return this.currentBeat + 1; // Return 1-based for UI
    }
    
    getTempo(): number {
        return this.tempo;
    }
    

}