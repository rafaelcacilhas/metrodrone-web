import { writable, derived, get } from 'svelte/store';
import {AudioContextUtil} from '../utils/audio-context'
import AudioOrchestrator from '../audio/AudioOrchestrator'
import { BeatSounds } from '../audio/engines/MetronomeEngine';

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
    if (shouldPlay) {
        getAudioManager().engine.playMetronome();
    } else {
        getAudioManager().engine.stopMetronome();
    }
});

export const isDroneActive = writable(false);
isDroneActive.subscribe((shouldPlay) => {
    if (shouldPlay) {
        getAudioManager().engine.playDrone();
    } else {
        getAudioManager().engine.stopDrone();
    }
});



// =========== DRONE CONTROL ========
export function toggleDrone():void {
	const manager = getAudioManager();
	const isActive = manager.isDronePlaying;

	if(!isActive){
		manager.startDrone({
			frequency: 	get(droneFrequency),
			volume: get(droneVolume),
			waveType:get(droneWaveType)
		});
	} else {
		manager.stopDrone();
	}

	isDroneActive.set(!isActive);
}

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
export function toggleMetronome():void {
	const manager = getAudioManager();
	const isActive = manager.isMetronomePlaying;

	if(!isActive){
		manager.startMetronome({
			tempo: get(tempo),
			numberOfBeats: get(numberOfBeats),
			beatSounds: get(beatSounds)
		})
	} else {
		manager.stopMetronome();
	}
	isMetronomeActive.set(!isActive)
}

export function updateTempo(newTempo:number):void{
	tempo.set(newTempo);
	getAudioManager().updateMetronome({tempo:newTempo})
}	

export function updateNumberOfBeats(newNumberOfBeats:number):void{
	numberOfBeats.set(newNumberOfBeats);
	if(get(isMetronomeActive)){
		getAudioManager().updateMetronome({numberOfBeats})
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
beatSounds.set(Array.from({ length: get(numberOfBeats) }, () => BeatSounds.Kick));

// Subscribe to beat changes from audio manager
// getAudioManager().onBeatChange((beat: number) => {
//     currentBeat.set(beat);
// });

// ========== CLEANUP ==========
// export function disposeAudio(): void {
//     if (audioManager) {
//         audioManager.dispose();
//         audioManager = null;
//     }
//     AudioContextSingleton.close();
//     console.log('Audio system disposed');
// }


// export const audioEngine = new AudioEngine({
// 	volume: initialVolume,
// 	droneFrequency: initialDroneFrequency,
// 	waveType: initialWaveType,
// 	numberOfBeats: initialNumberOfBeats,
// 	tempo: initialTempo,
// });

// export const octaveFactor = 1; // TODO: implement octave swapping

// export const droneFrequency = writable(initialDroneFrequency/octaveFactor);
// droneFrequency.subscribe((freq : number) =>{
// 	audioEngine.setDroneFrequency(freq/octaveFactor)
// })

// export const selectedNote = writable('A');

// export const isDronePlaying = writable(false);
// isDronePlaying.subscribe((shouldPlay) => {
// 	if(shouldPlay) audioEngine.playDrone();
// 	else audioEngine.stopDrone();
// })

// export const tempo = writable(initialTempo);
// tempo.subscribe((tempo : number) =>{	
// 	audioEngine.setTempo(tempo)
// })
// export const isMetronomePlaying = writable(false);
// isMetronomePlaying.subscribe((shouldPlay) => {
// 	if(shouldPlay) audioEngine.playMetronome();
// 	else audioEngine.stopMetronome();
// })

// export const beats = writable(audioEngine.getBeatSound());

// export const currentBeat = writable(audioEngine.getCurrentBeat());
				
// export const tempo = writable(initialTempo);
// tempo.subscribe((newTempo: number) => {
// 	audioEngine.setTempo(newTempo);
// })
