import { writable, get } from 'svelte/store';
import {AudioContextUtil} from '../utils/audio-context'
import AudioOrchestrator from '../audio/AudioOrchestrator'

export enum BeatSounds {None, Kick, Snare, HiHat}

// ========== TEMP ==================
export const octaveFactor = writable(1);
export const selectedNote = writable('A');
export const  audioEngine  = writable('A');
export const beats = writable([{sound:BeatSounds.Kick}]);


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
	numberOfBeats.set(newNumberOfBeats);
	beatSounds.update(currentSounds => {
		const newSounds = [...currentSounds];

		if(newNumberOfBeats > currentSounds.length){
			for(let i = currentSounds.length; i < newNumberOfBeats; i++){
				newSounds[i] = BeatSounds.Kick;
			}
		} else{
			newSounds.length = newNumberOfBeats;
		}
		return newSounds;
	})
	if(get(isMetronomeActive)){
		getAudioManager().updateMetronome({
			numberOfBeats:get(numberOfBeats),
			beatSounds:get(beatSounds)
		})
	}
}

export function updateBeatSound(beatIndex:number, sound:BeatSounds):void{
	beatSounds.update(sounds => {
		const newSounds = [...sounds];
		newSounds[beatIndex] = sound;
		return newSounds
	});

	if(get(isMetronomeActive)){
		getAudioManager().updateMetronome({beatSounds:get(beatSounds)})
	}
}

export function getBeatSound(beatIndex:number):BeatSounds{
	const sounds = get(beatSounds);
	return sounds[beatIndex] || BeatSounds.Kick
}


//============ DERIVED STORES ==============
// export const audioContextState = derived(
// 	[AudioContextManager, getState],
// 	([$state]) => $state
// )

// export const isAudioActive = derived(
//     [isDroneActive, isMetronomeActive],
//     ([$drone, $metronome]) => $drone || $metronome
// );

// ========== INITIALIZATION ====	======
// Initialize beat sounds array

