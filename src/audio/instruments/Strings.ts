import { EnvelopeFilter, type EnvelopeParameters } from '../fx/EnvelopeFilter';
import type { Instrument } from 'src/audio/instruments/Instrument';
import { LowPassFilter } from '../fx/LowPassFilter';
import { DetunedVoiceBank } from '../synth/DetunedVoiceBank';

export class StringEnsemble implements Instrument {
  private voices: DetunedVoiceBank = [] as unknown as DetunedVoiceBank;

  private filter: LowPassFilter;
  private envelope: EnvelopeFilter;
  private envelopeParams: EnvelopeParameters;
  public output: GainNode; 

  private audioContext: AudioContext;
  private baseFrequency: number;


  constructor(audioContext: AudioContext, baseFrequency: number) {
    this.baseFrequency = baseFrequency;
    this.audioContext = audioContext;
    const voiceCount = 6;
    const detuneSpread =  0.005;
    const volume = 0.05;
    this.voices = new DetunedVoiceBank(this.audioContext,this.baseFrequency, voiceCount, detuneSpread);
    this.voices.node.gain.value = volume;

    const frequency = baseFrequency;
    const q = 1; 
    this.filter = new LowPassFilter(this.audioContext, frequency, q)

    this.envelopeParams = {attack: 1, decay: 1, sustain: 1, release: 1}
    this.envelope = new EnvelopeFilter( this.audioContext, this.envelopeParams );

    this.output = this.audioContext.createGain();

    this.voices.node.connect(this.filter.node);
    this.filter.node.connect(this.envelope.node);
    this.envelope.node.connect(this.output);

  }

  start(time?:number) {
    const startTime = time || this.audioContext.currentTime;
    this.voices.start(startTime);
    this.envelope.start(startTime)
  }

  stop(time?:number){
    const stopTime = time || this.audioContext.currentTime;
    this.envelope.setRelease(stopTime);
    this.voices.stop(stopTime) ;
  }

  dispose(){
    this.voices.dispose();
    this.voices =  [] as unknown as DetunedVoiceBank;

    this.filter.dispose()
    this.envelope.stop()
  }

  connect(destination:AudioNode){
    this.output.connect(destination)
  }

  disconnect(){
    this.output.disconnect();
  }

  setFrequency(newFrequency: number){
    this.voices.setFrequency(newFrequency)
  }

  setVoiceSpread(newSpread:number){
    this.voices.setVoiceSpread(newSpread);
  }
}