export interface Instrument {
    output: AudioNode| null;
    start(time?: number): void;
    stop(time?: number): void;
    connect(destination: AudioNode): void;
}