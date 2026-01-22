<script>
import Knob from "./Knob.svelte";

let value = 0;
</script>

<section class="container">
    Audio lab
    <Knob bind:value={value} max={100} min={0} pixelRange={200}/>

</section>

<style>
    .container{
        padding: 0;
        min-width: 20rem;
        min-height: 20rem;
        background-color: gray;
    }
</style>