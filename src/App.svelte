<script lang="ts">
	import './app.css';
	import Metronome from './components/Metronome.svelte';
	import Drone from './components/Drone.svelte';
    import NavigationMenu from './components/NavigationMenu.svelte';
</script>

<main>
  	<NavigationMenu />
	<Metronome />
	<Drone />
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
