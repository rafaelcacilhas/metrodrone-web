import Cello from './sounds/Cello';
import { StringEnsemble } from './sounds/Strings';

export type DroneInstrumentProps = {
    audioContext: AudioContext;
    waveType: OscillatorType;
    frequency: number;
    volume:number;
}

export default class Drone {
    public audioContext: AudioContext;

    private instrument:StringEnsemble;
    public waveType: OscillatorType; // TODO: Cleanup this, not used
    public frequency: number;
    public volume: number;
    public audioAnalyser: AnalyserNode;

    constructor(config: DroneInstrumentProps){
        this.audioContext = config.audioContext;
        this.waveType = config.waveType;
        this.frequency = config.frequency;
        this.volume = config.volume;

        this.instrument = this.createNewInstrument();
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.instrument.connect(this.audioAnalyser);
    } 

    drawVisualizer: () => void = () => {
        this.audioAnalyser.connect(this.audioContext.destination);
        this.audioAnalyser.fftSize=64;

        const bufferSize = this.audioAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferSize);

        const soundCanvas = document.getElementById("soundCanvas") as HTMLCanvasElement;
        if(!soundCanvas) return;
        soundCanvas.width = window.innerWidth;
        soundCanvas.height = window.innerHeight;
        const canvasContext = soundCanvas.getContext('2d')

        const barWidth = soundCanvas.width/bufferSize;
        let barHeight = 0;
        let x;

        const animate = (audioAnalyser:AnalyserNode) =>{
            x = 0;
            if(!canvasContext) return;
            canvasContext.clearRect(0,0,soundCanvas.width, soundCanvas.height);
            audioAnalyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < bufferSize; i++){
                const red = i;
                const blue = i;
                const green = i;

                barHeight = dataArray[i]
                canvasContext.fillStyle = "white";
                canvasContext.fillRect(x, soundCanvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
                console.log(x, dataArray[i])
            }

            requestAnimationFrame(() => animate(this.audioAnalyser));
        }

        animate(this.audioAnalyser);

    }

    createNewInstrument: () => StringEnsemble = () => {
        const instrument = new StringEnsemble(this.audioContext, this.frequency);
        instrument.connect(this.audioContext.destination);
        return instrument;
    }

    play: () => void = () =>{
        if(!this.instrument) this.instrument = this.createNewInstrument();
        this.instrument.start();
        this.drawVisualizer();
    };

    stop: () => void = () =>{
        if(!this.instrument) return;
        this.instrument.stop();
        this.instrument.disconnect();
    }

    setDroneFrequency: (frequency: number) => void = (frequency) => {
        if(!this.instrument) return
        this.instrument.setFrequency(frequency);
    }
}