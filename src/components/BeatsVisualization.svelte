<script lang="ts">
    import {currentBeat, audioEngine, beats } from '../stores/audio';
    import { BeatSounds } from '../audio/engines/MetronomeEngine';

    const handleClick = (beat: number) =>{  
    let newSound;
    console.log('beat', beat, $beats[beat].sound)
    switch($beats[beat].sound) {
        case BeatSounds.Kick:
            newSound = BeatSounds.Snare;
            break;
        case BeatSounds.Snare:
            newSound = BeatSounds.HiHat;
            break;
        case BeatSounds.HiHat:
            newSound = BeatSounds.None;
            break;
        case BeatSounds.None:
            newSound = BeatSounds.Kick;
            break;
        default:
            newSound = BeatSounds.None;
            break;
    }   

    audioEngine.setBeatSound(beat,newSound)     
    beats.set(audioEngine.getBeatSound())
    console.log('engine, beats  ')
    }     

    const getBeatIcon = (beat:number)=> {
    switch ( $beats[beat].sound){
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
        const updatedBeats = $beats
        updatedBeats.push({sound: BeatSounds.HiHat})
        beats.set(updatedBeats)
    }

    const removeBeat = () => {
        const updatedBeats = $beats
        updatedBeats.pop()
        beats.set(updatedBeats)
    }

</script>

<div class="beatContainer">
    <div class="beatGraphics">
        {$currentBeat   }
        {#each $beats as beat,  index}
            { #if beat != undefined && index > 0 }
             <button 
                class={index  == $currentBeat? 'activeBeat':'beat'} 
                aria-label={'beat'}
                onclick={()=>handleClick(index)}
            > 
                {getBeatIcon(index)}
            </button>
            {/if}
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
        justify-content: center;
        align-items: flex-start;
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
        justify-content: center;
        align-items: flex-start;
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