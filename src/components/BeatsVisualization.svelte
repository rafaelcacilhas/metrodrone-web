<script>
  import {numberOfBeats, currentBeat } from '../stores/audio';
  
  const currentBeatLocal = $derived($currentBeat)
  let beats = $derived.by(() =>{
    const output = []
    for(let i = 0; i < $numberOfBeats; i++){
            output.push(i);
    }   
    return output
  });

</script>

<div class="beatContainer">
    <div class="beatGraphics">
        {#each beats as beat, index}
            <div class={index + 1 == currentBeatLocal? 'activeBeat':'beat'} > </div>
        {/each}
    </div>

    <div class="beatButtons">
        <button  class="beatButton"
            onclick={ ()=>{numberOfBeats.set($numberOfBeats-1)}}
        > - </button>
        <button class="beatButton"
            onclick={()=>{numberOfBeats.set($numberOfBeats+1)}}
        > + </button>
    </div>
</div>

<style>
    .beatContainer{
        width: 100%;
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .beatGraphics {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }
    .beat{
        border-width: 1;
        height: 3rem;
        width: 1rem;
        background-color: var(--color-text);
    }
    .activeBeat{
        border-width: 1;
        height: 3rem;
        width: 1rem;
        background-color: var(--color-secondary);
    }
    .beatButtons{
        display: flex;
        gap: 0.5rem;
    }
    .beatButton{
        width: 2.5rem;
        height:1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>