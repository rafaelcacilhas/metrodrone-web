<script lang="ts">
	import './app.css';
	import Drone from './components/Drone.svelte';
	import Metronome from './components/Metronome.svelte';
    // import NavigationMenu from './components/NavigationMenu.svelte';
    // import SoundVisualizer from './components/SoundVisualizer.svelte';
	
</script>

<main>
  	<!-- <NavigationMenu /> -->
	<Metronome />
	<Drone />
	<!-- <SoundVisualizer /> -->
</main>

<style>
	main {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 0;
	}
</style>
