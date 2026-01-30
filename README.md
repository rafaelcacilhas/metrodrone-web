# Metrodrone

This is a web app made of a metronome and a drone player. It consists of a typescript engine that will synthesize sounds and a Svelte frontend to control it. We also use [shadcn-svelte](https://www.shadcn-svelte.com) for some UI components.

## Core Philosophy

Audio-first reactive application. The audio engine is the source of truth; the UI is a control surface that mirrors its state.

## State Management

Three-layer model:

1. **Audio Engine** (Typescript) – Imperative, real-time
2. **Store Bridge** (Svelte stores) – Reactive translation layer  
3. **UI Components** (Svelte) – Declarative controls

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

## Interface Contracts

### Audio Engine Public API

```typescript
interface BaseEngine {

  type BaseEngineProps = {
      audioContext: AudioContext;
      numberOfBeats:number;
      baseFrequency:number;
      tempo:number;
      volume:number;
  }

  // Drone control
  playDrone(): void
  stopDrone(): void
  updateDroneFrequency(hz: number): void

  // Metronome control
  playMetronome(): void
  stopMetronome(): void
  setTempo(bpm: number): void
  setBeatNumber(beats: number): void
  setMetronomeVolume(gain: number): void
}