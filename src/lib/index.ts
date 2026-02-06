// metrodrone/src/lib/index.js
// This is what Astro will import from

// Export main app
export { default as MetrodroneApp } from '../App.svelte';

// Export individual components
export { default as Metronome } from '../components/Metronome.svelte';
export { default as BeatVisualization } from '../components/BeatsVisualization.svelte';

// Export stores
export { 
  tempo,
  beatSounds,
  currentBeat,
  updateTempo,
  updateNumberOfBeats,
  updateBeatSound,
  isMetronomeActive,
} from '../stores/audio';

// Export utilities
export { audioContextUtil } from '../utils/audio-context';