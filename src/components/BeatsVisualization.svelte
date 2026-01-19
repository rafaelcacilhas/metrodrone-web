<script>
// @ts-nocheck

  import {numberOfBeats } from '../stores/audio';
  
  const beats = []
  const activeBeat = 1;

  for(let i = 0; i < $numberOfBeats; i++){
    beats.push(i);
  }

</script>

<div class="beatContainer">
    <div class="beatGraphics">
        {#each beats as beat, index}
            <div class={index + 1 == activeBeat? 'activeBeat':'beat'} > </div>
        {/each}
    </div>

    <div class="beatButtons">
        <button 
            onclick={ ()=>{numberOfBeats.set(numberOfBeats-1)}}
        > - </button>
        <button 
            onclick={()=>{numberOfBeats.set(numberOfBeats+1)}}
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
</style>