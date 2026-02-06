# Metrodrone

This is a web app made of a metronome and a drone player. It consists of a typescript engine that will synthesize sounds and a Svelte frontend to control it. We also use [shadcn-svelte](https://www.shadcn-svelte.com) for some UI components. You can run it with


```bash
yarn
yarn dev
```

## State Management

Three-layer model:
1. **UI Components** (Svelte) – Declarative controls
2. **Store Bridge** (Svelte stores) – Reactive translation layer  
3. **Audio Engine** (Typescript) – Imperative, real-time

## Architecture

```bash
src/
├── audio/           # Audio engine modules
│   ├── engines
│       ├── BaseEngine.ts
│       ├── DroneEngine.ts
│       ├── MetronomeEngine.ts
│   ├── fx/
│   │   ├── FXChain.ts
│   │   ├── LowPass.ts
│   │   └── Reverb.ts
│   └── instruments/      # Ready to use Instruments
│   │   ├── Drums.ts
│   │   ├── Strings.ts
│   └── synth/           # Base sounds
│   │   ├── DetunedVoiceBank.ts
│   │   ├── DrumSynth.ts
├── components/      # Svelte UI components
│   ├── DroneControl.svelte
│   ├── MetronomeControl.svelte
│   ├── FilterPanel.svelte
│   └── ...
├── stores/          # Svelte stores for app state
│   └── audio.ts     # Reactive bridge to audio engine
├── utils/
│   └── audio-context.ts     # Singleton audioContextInstance
├── App.svelte
└── main.ts

```

TODO for version 2.0:
0.  Remove AudioOrchestrator - BaseEngine can do its work.
1.  Expand sound library (5-8 basic percussion)
2.  Volume control
3.  Allow changing A = 440 hz to different values
4.  Global filter controls
5.  Pattern presets/save/load
6.  More precise timing options (swing, triplets)
7.  Adding tests, I suppose? 

<img width="2810" height="1016" alt="architecture" src="https://github.com/user-attachments/assets/d3254872-b1e9-4d4d-8698-4e0ced9c5dae" />


