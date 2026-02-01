import type { Instrument } from 'src/audio/instruments/Instrument';
import { DrumSynth } from '../synth/DrumSynth'; 
import {BeatSounds} from '../../stores/audio';

export class Drums implements Instrument{
  private audioContext: AudioContext;
  private baseFrequency: number;
  public output: GainNode | null;
  private drumSynth:DrumSynth| null;

  constructor(audioContext: AudioContext, baseFrequency: number, tempo:number) {
    this.audioContext = audioContext;
    this.baseFrequency = baseFrequency/2;
    this.output = audioContext?.createGain();
    this.drumSynth = new DrumSynth(audioContext,this.baseFrequency)
    this.drumSynth.connect(this.output);
  }

  start( time?:number, sound?:BeatSounds) {
    if(!this.output){
      this.output = this.audioContext?.createGain();
    }
    if(!this.drumSynth) {
      this.drumSynth = new DrumSynth(this.audioContext,this.baseFrequency)
      this.drumSynth.connect(this.output);
    }

    const startTime = time || this.audioContext.currentTime;
      switch(sound){
        case BeatSounds.Kick:
            this.drumSynth.playKick(startTime);
            break;
        case  BeatSounds.Snare:
            this.drumSynth.playSnare(startTime);
            break;
        case  BeatSounds.HiHat:
            this.drumSynth.playHihat(startTime);
            break;
        case  BeatSounds.None:
            break;
        default: 
            break;
      }
  }

  stop(time?:number){
    const stopTime = time || this.audioContext.currentTime;
    this.drumSynth?.stop();
  }

  dispose(){
    this.drumSynth?.disconnect();
    this.output?.disconnect();
    this.drumSynth = null;
    this.output = null;
  }

  connect(destination:AudioNode){
    this.output?.connect(destination)
  }

  disconnect(){
    this.output?.disconnect();
  }

  setFrequency(newFrequency: number){
    this.baseFrequency = newFrequency
  }
}