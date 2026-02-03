import { getAudioContext } from '../utils/audio-context';
import MetronomeEngine from './engines/MetronomeEngine';
import DroneEngine from './engines/DroneEngine';
import BaseEngine from './engines/BaseEngine';

export type AudioOrchestratorProps = { 
    audioContext: AudioContext;
    numberOfBeats: number;
    tempo: number;
    baseFrequency: number;
    onBeatChange: (beat:number)=>void;
}

export default class AudioOrchestrator  {

    public audioContext: AudioContext;

    public isMetronomePlaying: boolean = false;
    public isDronePlaying: boolean = false;

    private  drone:DroneEngine | null ;
    private  metronome:MetronomeEngine | null;
    public   engine:BaseEngine ;

    constructor(params:AudioOrchestratorProps) {
        this.audioContext = params.audioContext || getAudioContext();

        this.engine = new BaseEngine({
            audioContext: this.audioContext,
            numberOfBeats:params.numberOfBeats,
            baseFrequency:params.baseFrequency,
            tempo:params.tempo,
            onBeatChange:params.onBeatChange,
            volume:0.05, // TODO Add volume control
        });

        this.drone = this.engine.droneEngine
        this.metronome =this.engine.metronomeEngine;
    }

    async startDrone(){
        if(this.isDronePlaying) return;

        await this.audioContext.resume();
        this.drone?.play();
        this.isDronePlaying = true;
    }

    async startMetronome(){
        if(this.isMetronomePlaying) return;

        await this.audioContext.resume();
        this.metronome?.play();
        this.isMetronomePlaying = true;
    }

    stopDrone(){
        if(!this.isDronePlaying) return;

        this.drone?.stop();
        this.isDronePlaying = false;
    }

    stopMetronome(){
        if(!this.isMetronomePlaying) return;

        this.metronome?.stop();
        this.isMetronomePlaying = false;
    }

    updateMetronome(params:any){
        const wasPlaying = this.isMetronomePlaying;

        if(wasPlaying){
            this.metronome?.stop();
        }

        this.metronome?.updateParams(params);

        if(wasPlaying){
            this.metronome?.play();
        }

    }

    updateDrone(params:any){  // TODO: Route into BaseEngine
        const wasPlaying = this.isDronePlaying;
        if(wasPlaying){
            this.drone?.stop();
        }
        this.drone?.updateParams(params);
        if(wasPlaying){
            this.drone?.play();
        }
    }

    disposeDrone(){
        this.stopDrone();
        this.drone?.dispose();
    }

    disposeMetronome(){
        this.stopMetronome();
        this.metronome?.dispose();
    }
}





