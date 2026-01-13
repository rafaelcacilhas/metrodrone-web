<script lang="ts">
  import { droneFrequency, isPlaying } from './stores/audio';

  import AudioEngine from './audio/engine'

  import BeatsVisualization from './components/BeatsVisualization.svelte';

  const audioEngine = new AudioEngine();

</script>

<main>
  <section>
    <h1>Metronome</h1>
    <BeatsVisualization />
    {#if isPlaying}
      <button onclick={()=>audioEngine.play()}> pause </button>
    {:else}
      <button onclick={()=>audioEngine.play()}> play </button>
    {/if}

  </section>

  <section>
    <h1>Drone</h1>
    <p>Frequency: {$droneFrequency}</p>

    <button> {isPlaying? "pause":"play"} </button>

    <div class="droneFrequencyControls">
      <button onclick={() => droneFrequency.set($droneFrequency - 10)}> - </button> 
      <button onclick={() => droneFrequency.set($droneFrequency + 10)}> + </button>
    </div>

  </section>  

</main>

<style>
  main{
    width: 100%;
    border: 1px solid var( --color-text);
    display: flex;
    justify-content: space-around;
  }

  section{
    width: 50%;
    min-width: 35vw;
    border: 1px solid white;
  }

  .droneFrequencyControls{
    margin: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

</style>
