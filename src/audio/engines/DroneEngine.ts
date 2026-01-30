import { StringEnsemble } from '../instruments/Strings';

export type DroneInstrumentProps = {
    audioContext: AudioContext;
    waveType: OscillatorType;
    frequency: number;
    volume:number;
}

export default class DroneEngine {
    public audioContext: AudioContext;

    private instrument:StringEnsemble | null;
    public waveType: OscillatorType; // TODO: Cleanup this, not used
    public frequency: number;
    public volume: number;
    public audioAnalyser: AnalyserNode;

    private isPlaying:boolean = false;

    constructor(config: DroneInstrumentProps){
        this.audioContext = config.audioContext;
        this.waveType = config.waveType;
        this.frequency = config.frequency;
        this.volume = config.volume;

        this.instrument = this.createNewInstrument();
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.instrument.connect(this.audioAnalyser);
    } 

    play: () => void = () =>{
        if(!this.instrument) this.instrument = this.createNewInstrument();
        this.instrument.start();
        this.drawVisualizer();
    };

    stop: () => void = () =>{
        if(!this.instrument) return;
        this.instrument.stop();
    }

    dispose(){
        if(this.isPlaying) this.stop();
        if(this.instrument){
            this.instrument.disconnect();
            this.instrument.dispose();
            this.instrument = null;
        }
    }

    drawVisualizer: () => void = () => {
        this.audioAnalyser.connect(this.audioContext.destination);
        this.audioAnalyser.fftSize=256;

        const bufferSize = this.audioAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferSize);

        const soundCanvas = document.getElementById("soundCanvas") as HTMLCanvasElement;
        if(!soundCanvas) return;
        soundCanvas.width = window.innerWidth;
        soundCanvas.height = window.innerHeight;
        const canvasContext = soundCanvas.getContext('2d')

        const widthScale = 8.0;
        const barWidth =    widthScale* soundCanvas.width/bufferSize;
        let barHeight = 0;
        let x;

        const animate = (audioAnalyser:AnalyserNode) =>{
            x = 0;
            if(!canvasContext) return;
            canvasContext.clearRect(0,0,soundCanvas.width, soundCanvas.height);
            audioAnalyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < bufferSize/4; i++){
                const red = barHeight;
                const blue = barHeight*i;
                const green = i;

                barHeight = dataArray[i]
                canvasContext.fillStyle = 'rgb('+red + ',' + green + ',' + blue;
                canvasContext.fillRect(x, soundCanvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
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

    setDroneFrequency: (frequency: number) => void = (frequency) => {

    }

    updateParams(params:any){
        const wasPlaying = this.isPlaying;
        if(wasPlaying){
            this.stop();
        }
        if(params.frequency){
            this.frequency = params.frequency;
            if(this.instrument){
                this.instrument.setFrequency(params.frequency);
            }
        }

        if(wasPlaying){
            this.play();
        }
    }
}