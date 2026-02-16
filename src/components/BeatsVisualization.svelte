<script lang="ts">
    import { derived } from 'svelte/store';
    import {
        numberOfBeats, 
        currentBeat, 
        beatSounds,
        updateBeatSound, 
        BeatSounds,
        updateNumberOfBeats
    } from '../stores/audio';

    export const beatSymbols = derived(
        [beatSounds, numberOfBeats],
        ([$beatSounds,$numberOfBeats]) =>{
            return Array.from({ length: $numberOfBeats }, (_, index) => {
                const sound = $beatSounds[index];
                switch(sound){
                    case BeatSounds.None:return '✖'; 
                    case BeatSounds.Kick:return '◼'; 
                    case BeatSounds.Snare:return '●'; 
                    case BeatSounds.HiHat:return '▲'; 
                }
            })
        }
    )

    const handleClick = (beatIndex: number) =>{  
        const currentSound = $beatSounds[beatIndex];
        const nextSound = getNextBeatSound(currentSound);
        updateBeatSound(beatIndex,nextSound)
    }     

    const getNextBeatSound = (currentSound:BeatSounds) => {
        const sounds = [BeatSounds.None, BeatSounds.Kick, BeatSounds.Snare, BeatSounds.HiHat]
        const currentIndex = sounds.indexOf(currentSound);
        return sounds[(currentIndex+1)%sounds.length];
    }

    const addBeat = () => {
        updateNumberOfBeats($numberOfBeats +1) ;
    }

    const removeBeat = () => {
        if ($beatSounds.length <= 1) return;
        updateNumberOfBeats($numberOfBeats - 1) ;
    }

</script>

<div class="beatContainer">
    <div class="beatGraphics">
        {#each  Array.from({ length: $numberOfBeats }) as _,  index}
             <button 
                class={index  == $currentBeat? 'activeBeat':'beat'} 
                aria-label={'beat' + (index+1) }
                onclick={()=>handleClick(index)}
            > 
            <p class="currentBeat">{index +1}</p>
                {$beatSymbols[index]}
            </button>
        {/each}
    </div>

    <div class="beatButtons">
        <button  class="beatButton"
            onclick={ removeBeat }
        > - </button>
        <button class="beatButton"
            onclick={addBeat}
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
        color: var(--color-bg);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: smaller;
    }
    .activeBeat{
        border-width: 1;
        height: 3rem;
        width: 1rem;
        background-color: var(--color-secondary);   
        color: var(--color-bg);
        font-size: smaller;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .currentBeat{
        color:black;
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

      @media (max-width: 768px) {
        .beatContainer{
            width: 100%;
            margin: 1rem 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
        }

    .beatGraphics {
        gap: 0.5rem;
    }
    .beatButtons{       
            gap: 0.2rem;
        }
      }
</style>