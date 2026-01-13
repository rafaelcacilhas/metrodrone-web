  import { isPlaying } from '../stores/audio';

interface AudioInterface {
    play: () => void;
    stop: () => void;   
    oscillator:OscillatorNode
}

/*
    Input -> Effects -> Destination
    
    1 - Create audio context
    2 - Create sources — such as <audio>, oscillator, stream
    3 - Create effects nodes, such as reverb, biquad filter, panner, compressor
    4 - Choose final destination of audio
    5 - Connect the sources up to the effects, and the effects to the destination.
*/

export default class AudioEngine implements AudioInterface {


    context = new AudioContext();
    mainGainNode = this.context.createGain();
    oscillator = this.context.createOscillator();
    volume = 100;

    buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 22050,
        sampleRate: 44100,
    });

    constructor() {
    }

    play: () => void = () =>{
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = 440;
        this.oscillator.connect(this.mainGainNode);
        this.oscillator.start();
        isPlaying.set(true);
        console.log("play")
    };
  


    stop: () => void = () =>{
        this.oscillator.stop();
        isPlaying.set(false);
        console.log("stop")
    }
}