<script>

</script>

<section class="container" >
    <canvas id="soundCanvas">
    </canvas>
</section>

<style>
    .container{ 
        opacity:0.5;
        display:flex;
        align-items: center;
        justify-content: center;    
    }

    #soundCanvas{   
        max-width:200px;
        max-height: 200px;  
        position:relative;
        top: -1.5rem;
    }
    @media (max-width: 768px) {
        #soundCanvas{
            left:2rem;
        }
    }
    @container (max-width: 768px) {
        #soundCanvas{
            left:2rem;
        }
    }
</style>