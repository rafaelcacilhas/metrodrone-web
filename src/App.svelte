<script lang="ts">
	import './app.css';
	import Drone from './components/Drone.svelte';
	import Metronome from './components/Metronome.svelte';	
</script>

<main>
	<Metronome />
	<Drone />
</main>

<style>
	main {
		width: 100vw;
		max-width: 700px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 0;
	}

	@media (max-width: 640px) {
		main {
			flex-direction: column;
			align-items:center;
			gap: 3rem;
		}
	}	

	@container (max-width: 640px) {
		main {
			flex-direction: column;	
			align-items:center;
			gap: 3rem;
		}
	}	
</style>
