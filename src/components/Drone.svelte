<script lang="ts">
  import {selectedNote, droneFrequency, isDroneActive, octaveFactor, updateDroneFrequency} from '../stores/audio';

  const   AFrequency = 440.0;
  // TODO: Write all frequencies using A as a reference

  const naturals = [
    {name: 'C',freq: 130.81 },
    {name: 'D',freq: 146.83 },
    {name: 'E',freq: 164.81 },
    {name: 'F',freq: 174.61 },
    {name: 'G',freq: 196  },
    {name: 'A',freq: 220 },
    {name: 'B',freq: 246.94 }
  ]

  const accidentals = [
    {name: 'C#',freq: 138.59 },
    {name: 'D#',freq: 155.56 },
    null,
    {name: 'F#',freq: 185 },
    {name: 'G#',freq: 207.65 },
    {name: 'A#',freq: 233.08 },
  ]

</script>

  <section>
    <h1>Drone</h1>
    <h2> {$selectedNote}</h2>
    <p class="tag">{$droneFrequency/$octaveFactor} Hz </p>

    <div class="keyboard">
      <div class="accidentals">
        {#each accidentals as note}
          {#if note}
            <button
              class="key"
              onclick={()=> {
                updateDroneFrequency(note.freq)
                selectedNote.set(note.name)
              }}
            >
              {note.name}
            </button>
            {:else}
              <button class="no-key" aria-label="does nothing"> </button>          
            {/if}
        {/each}
      </div>
      <div class="naturals">
        {#each naturals as note}
          <button
            class="key"
            onclick={()=> {
                updateDroneFrequency(note.freq)
                selectedNote.set(note.name)
              }}
            >
            {note.name}
          </button>

        {/each}
      </div>

    </div>

    <div class="buttonSection">
      <button onclick={()=> isDroneActive.set(!$isDroneActive)}> 
        {$isDroneActive? 'pause' : 'play'} 
      </button>

      <button disabled> 
        A 440hz
      </button>
    </div>
  </section>  

<style>
  section{
    width: 45%;
    min-width: 35vw;
  }

  .tag{
    font-size: 18;
    text-transform:'uppercase';
    letter-spacing: 3;
    margin-top: -1rem;

    margin-bottom: 2rem;
  }

  .keyboard{
    display: flex;
    margin: 1.5rem;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .key{
    width: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .no-key{
    width: 1rem;
    background-color: var(--color-bg);
    pointer-events: none;

  }

  .naturals{
    display: flex;
    justify-content: start;
    gap: 0.5rem;
  }

  .accidentals{
    display: flex;
    justify-content: start;
    gap: 0.5rem;
  }

  .buttonSection{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

</style>
