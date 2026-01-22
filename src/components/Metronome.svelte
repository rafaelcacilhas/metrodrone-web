
<script lang="ts">
  import { tempo, metronomeTempo, isMetronomePlaying } from '../stores/audio';
  import BeatsVisualization from './BeatsVisualization.svelte';
  import { Slider } from "$lib/components/ui/slider/index.js";
  
  let sliderValue = $metronomeTempo;
  function handleChange(newValue:number) {
    metronomeTempo.set(newValue);
  }

  const AFrequency = 440.0;
  // TODO: Write all frequencies using A as a reference


</script>

  <section>
    <h1>Metronome</h1>
    <h2>{$metronomeTempo}</h2>
    <p class="tag"> BPM </p>
    <Slider 
      onValueCommit={handleChange}
      type="single" bind:value={sliderValue} max={250} step={1} 
      class="max-w-[50%] bg-violet-400" 
    />

    <BeatsVisualization />
    <button onclick={()=> isMetronomePlaying.set(!$isMetronomePlaying)}> 
      {$isMetronomePlaying? 'pause' : 'play'} 
    </button>

  </section>

<style>
  section{
    width: 45%;
    min-width: 35vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tag{
    font-size: 18;
    text-transform:'uppercase';
    letter-spacing: 3;
    margin-top: -1rem;

    margin-bottom: 2rem;
  }
</style>
