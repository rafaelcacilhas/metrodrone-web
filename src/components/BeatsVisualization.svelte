<script lang="ts">
    import { derived } from 'svelte/store';
    import {numberOfBeats, currentBeat, beatSounds } from '../stores/audio';
   import { updateBeatSound, BeatSounds } from '../stores/audio';



    export let activeBeat = $currentBeat;
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
        console.log('click', beatIndex,currentSound,nextSound )
        updateBeatSound(beatIndex,nextSound)
    }     

    const getNextBeatSound = (currentSound:BeatSounds) => {
        const sounds = [BeatSounds.None, BeatSounds.Kick, BeatSounds.Snare, BeatSounds.HiHat]
        const currentIndex = sounds.indexOf(currentSound);
        return sounds[(currentIndex+1)%sounds.length];
        $beatSounds = $beatSounds;
    }

    const getBeatIcon = (beat:number)=> {
        switch (  $beatSounds[beat]){
            case BeatSounds.Kick:
                return '◼ ';
            case BeatSounds.HiHat:
                return  '▲';
            case BeatSounds.Snare:
                return '●';
            case BeatSounds.None: 
                return '✖'; 
        }
    }

    const addBeat = () => {
        const updatedBeats = beats
        updatedBeats.push({sound: BeatSounds.HiHat})
        beatSounds.set(updatedBeats)
    }

    const removeBeat = () => {
        const updatedBeats = $beatSounds
        updatedBeats.pop()
        beatSounds.set(updatedBeats)
    }

    const beats = [
        null,
        {sound:BeatSounds.Kick},
        {sound:BeatSounds.Kick},
        {sound:BeatSounds.Kick},
        {sound:BeatSounds.Kick},
    ]
</script>

<div class="beatContainer">
    {$currentBeat   }

    <div class="beatGraphics">
        {#each  Array.from({ length: $numberOfBeats }) as beat,  index}
             <button 
                class={index  == $currentBeat? 'activeBeat':'beat'} 
                aria-label={'beat'}
                onclick={()=>handleClick(index)}
            > 
            <p class="currentBeat">{index +1}</p>
                {beatSymbols[index]}
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
</style>