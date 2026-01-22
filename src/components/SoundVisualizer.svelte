<script>
import Knob from "./Knob.svelte";

let value = 0;
</script>

<section class="container" >
    <canvas id="soundCanvas">
    </canvas>
</section>

<style>
    .container{
        border: 1px solid red;
        position:absolute;
        bottom: 0;
        left:35%;
        width:200px;
        max-height: 200px;
    }

    #soundCanvas{
        max-width:200px;
        max-height: 200px;  
    }
</style>