import { Drums } from '../instruments/Drums';
import { audioContextUtil } from '../../utils/audio-context';
import { BeatSounds } from '../../stores/audio';

export type MetronomeSchedulerProps = { 
    audioContext: AudioContext;
    numberOfBeats: number;
    tempo: number;
    baseFrequency: number;
    onBeatChange?:(beat:number) => void;
    beatSounds?: BeatSounds[];
}

type ControlChanges = {
    tempo?:number, 
    numberOfBeats?:number,
    beatSounds?:BeatSounds[]
};

export default class MetronomeEngine{ 
    public audioContext: AudioContext;
    private onBeatChange?:(beat:number) => void;
    public numberOfBeats: number;
    public tempo: number;
    public currentBeat: number = 0;

    private beatDuration: number;
    private noteDuration: number;
    private baseNoteDuration:number = 0.3
    
    private nextBeatTime: number;

    private schedulerId: number | null = null;

    private drums:Drums| null;
    private baseFrequency:number;
    public beats: BeatSounds[] = [];  
    
    private isPlaying: boolean = false;

    private pendingChanges: {
        beatSounds?: BeatSounds[];
        numberOfBeats?: number;
        tempo?: number;
    } | null = {};

    private shouldRestartAtBarStart:boolean = false;
    
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
        this.noteDuration = Math.min(this.baseNoteDuration, this.beatDuration / 3.0); 

        //Sound
        this.drums = new Drums(this.audioContext,config.baseFrequency, this.tempo)
        this.drums.connect(this.audioContext.destination);
        this.beats = config.beatSounds || Array(this.numberOfBeats).fill(BeatSounds.Kick);

        // State
        this.isPlaying = false;
        this.schedulerId = null;
    }

    // ================= PUBLIC API ================
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
        if(this.isPlaying) this.stop();
        if(this.drums){
            this.drums.dispose();
        }
        this.drums = null;
    }

    // =============== PRIVATE SCHEDULING ==============
    private scheduleSingleBeat(scheduleTime: number){
        const sound = this.beats[this.currentBeat]
        if(sound === BeatSounds.None || !sound){
            return;
        }

        this.drums?.start(scheduleTime, sound);
    }

    startScheduler(){
        if(!this.isPlaying) return;
        this.schedulerId = requestAnimationFrame(this.scheduleNextBeats);
    }

    private advanceToNextBeat(): void{
        if(this.onBeatChange){
            this.onBeatChange(this.currentBeat)
        }
        this.currentBeat= (this.currentBeat + 1) % this.numberOfBeats;
        this.nextBeatTime += this.beatDuration;

    }

    private scheduleNextBeats = ()=> {
        const currentTime = this.audioContext.currentTime;
        const scheduleAhead = 0.1;
        
        while(this.nextBeatTime < currentTime + scheduleAhead){
            if (this.shouldRestartAtBarStart && this.currentBeat === 0) {
                this.restartWithPendingChanges();
                return; 
            }
            this.scheduleSingleBeat(this.nextBeatTime);
            this.advanceToNextBeat();
        }

        if(this.isPlaying && !this.shouldRestartAtBarStart){
            this.schedulerId = requestAnimationFrame(this.scheduleNextBeats);
        }
    }

    // ========== CHANGE MANAGEMENT ==========    
    updateParams(params:ControlChanges){
        const wasPlaying = this.isPlaying;
        this.pendingChanges = {...this.pendingChanges, ...params}
        console.log('changes', this.pendingChanges)
        if(wasPlaying){
            this.shouldRestartAtBarStart = true;
            this.pendingChanges = {...this.pendingChanges, ...params}
        }
        else {
            this.applyQueuedChanges(this.pendingChanges);
            this.ensureDrums();
            return;
        }
        this.shouldRestartAtBarStart = true;
    }

    private applyQueuedChanges(params?:ControlChanges){
        const newParams = params || this.pendingChanges;
        if(!newParams) return;
        
        if (newParams.numberOfBeats) {
            const oldCount = this.numberOfBeats;
            this.numberOfBeats = newParams?.numberOfBeats;
            
            if(Number(newParams?.numberOfBeats) > oldCount){
                const newBeats = [...this.beats];
                for (let i = oldCount; i<this.numberOfBeats; i++){
                    newBeats[i] = BeatSounds.Kick;
                }
                this.beats = newBeats;
            } else if(newParams.numberOfBeats < oldCount){
                this.beats = this.beats.slice(0,newParams.numberOfBeats);
            }

            if (this.currentBeat >= this.numberOfBeats) {
                this.currentBeat = 0;
            }
        }
        
        if (newParams.beatSounds) {
            this.beats = newParams.beatSounds;

            if(newParams.beatSounds.length !== this.numberOfBeats){
                this.numberOfBeats = newParams.beatSounds.length
            }
        }
        
        if (newParams.tempo) {
            this.tempo = newParams.tempo;
            this.beatDuration = 60.0 / this.tempo;
            this.noteDuration = Math.min(this.baseNoteDuration, this.beatDuration / 3.0);
        }
        
        this.pendingChanges = null;
    }

    private ensureDrums(){
        if(!this.drums){
            this.drums = new Drums(this.audioContext, this.baseFrequency, this.tempo);
            this.drums.connect(this.audioContext.destination);
        }
    }

    private restartWithPendingChanges(){
        const wasPlaying = this.isPlaying;
        this.isPlaying = false;
        
        if (this.schedulerId !== null) {
            cancelAnimationFrame(this.schedulerId);
            this.schedulerId = null;
        }

        if (this.pendingChanges) {
            this.applyQueuedChanges();
            this.pendingChanges = null;
        }
        
        this.ensureDrums();

        this.currentBeat = 0;
        this.nextBeatTime = this.audioContext.currentTime + 0.1;
        this.shouldRestartAtBarStart = false;
        
        if (wasPlaying) {
            this.isPlaying = true;
            this.startScheduler();
        }
    }

}