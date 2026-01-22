import { writable } from 'svelte/store';
import AudioEngine from '../audio/Engine';

const initialDroneFrequency = 220.0;
const initialVolume = 0.05;
const initialWaveType = 'sawtooth';

const initialNumberOfBeats = 4;
const initialTempo = 100;

export const audioEngine = new AudioEngine({
	volume: initialVolume,
	droneFrequency: initialDroneFrequency,
	waveType: initialWaveType,
	numberOfBeats: initialNumberOfBeats,
	tempo: initialTempo,
});

export const octaveFactor = 1; // TODO: implement octave swapping

export const droneFrequency = writable(initialDroneFrequency/octaveFactor);
droneFrequency.subscribe((freq : number) =>{
	audioEngine.setDroneFrequency(freq/octaveFactor)
})

export const selectedNote = writable('A');

export const isDronePlaying = writable(false);
isDronePlaying.subscribe((shouldPlay) => {
	if(shouldPlay) audioEngine.playDrone();
	else audioEngine.stopDrone();
})

export const metronomeTempo = writable(initialTempo);
metronomeTempo.subscribe((tempo : number) =>{
	audioEngine.setTempo(tempo)
})
export const isMetronomePlaying = writable(false);
isMetronomePlaying.subscribe((shouldPlay) => {
	if(shouldPlay) audioEngine.playMetronome();
	else audioEngine.stopMetronome();
})

export const numberOfBeats = writable(initialNumberOfBeats);
numberOfBeats.subscribe((number: number) => {
	audioEngine.setNumberOfBeats(number);
})

export const currentBeat = writable(1);

export const tempo = writable(initialTempo);
tempo.subscribe((newTempo: number) => {
	audioEngine.setTempo(newTempo);
})

/*
set -> one argument which is the value to be set. 

update -> one argument which is a callback. The callback takes the existing
 store value as its argument and returns the new value to be set to the store.


count.subscribe((value) => {
	console.log(value);
}); // logs '0'

count.set(1); // logs '1'

count.update((n) => n + 1); // logs '2'

 */