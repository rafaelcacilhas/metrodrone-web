import { writable, get } from 'svelte/store';
import {AudioContextUtil} from '../utils/audio-context'
import AudioOrchestrator from '../audio/AudioOrchestrator'

export enum BeatSounds {None, Kick, Snare, HiHat}

// ========== TEMP ==================
export const octaveFactor = writable(1);
export const selectedNote = writable('A');

// ========== STATE STORES ==========
export const droneFrequency = writable(220.0);
export const droneVolume = writable(0.05);
export const droneWaveType = writable<OscillatorType>('sawtooth');

export const tempo = writable(100);
export const numberOfBeats = writable(4);
export const currentBeat = writable(0);
export const beatSounds = writable<BeatSounds[]>([]);

beatSounds.set(Array(get(numberOfBeats)).fill(BeatSounds.Kick));

// ========== AUDIO MANAGER =========
let audioManager: AudioOrchestrator|null = null;

function getAudioManager():AudioOrchestrator{
	if(audioManager === null){
		audioManager = new AudioOrchestrator({
			audioContext: AudioContextUtil.getContext(),
			numberOfBeats:get(numberOfBeats),
			baseFrequency:get(droneFrequency),
			tempo:get(tempo),
			onBeatChange:(beat:number) => {
				currentBeat.set(beat);
			}
		});
	}
	return audioManager;
}

// ========== ON / OFF ================
export const isMetronomeActive = writable(false);
isMetronomeActive.subscribe((shouldPlay) => {
	const manager = getAudioManager()
    if (shouldPlay) {
       manager.startMetronome();
    } else {
        manager.stopMetronome();
    }
});

export const isDroneActive = writable(false);
isDroneActive.subscribe((shouldPlay) => {
    if (shouldPlay) {
        getAudioManager().startDrone();
    } else {
        getAudioManager().stopDrone();
    }
});

// =========== DRONE CONTROL ========
export function updateDroneFrequency(frequency:number):void {
	droneFrequency.set(frequency);
	getAudioManager().updateDrone({frequency})
}

export function updateDroneVolume(volume:number):void{
	droneVolume.set(volume);
	if(get(isDroneActive)){
		getAudioManager().updateDrone({volume})
	}
}

// ========== METRONOME CONTROLS ============
export function updateTempo(newTempo:number):void{
	tempo.set(newTempo);
	getAudioManager().updateMetronome({tempo:newTempo})
}	

export function updateNumberOfBeats(newNumberOfBeats:number):void{
	beatSounds.update(currentSounds => {		
		const newSounds = [...currentSounds];
		console.log('update store', newNumberOfBeats, newSounds)
		if(newNumberOfBeats > currentSounds.length){
			newSounds.push(BeatSounds.Kick);
		} else{
			newSounds.length = newNumberOfBeats;
		}
		return newSounds;
	})

	numberOfBeats.set(newNumberOfBeats);

	getAudioManager().updateMetronome({
		numberOfBeats: newNumberOfBeats,
		beatSounds:get(beatSounds)
	})
}

export function updateBeatSound(beatIndex:number, sound:BeatSounds):void{
	beatSounds.update(sounds => {
		const newSounds = [...sounds];
		newSounds[beatIndex] = sound;
		return newSounds
	});

	getAudioManager().updateMetronome({
		beatSounds:get(beatSounds)}
	)

}

export function getBeatSound(beatIndex:number):BeatSounds{
	const sounds = get(beatSounds);
	return sounds[beatIndex] || BeatSounds.Kick
}
