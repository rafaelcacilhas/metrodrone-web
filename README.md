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

src/
├── audio/           # Audio engine modules
│   ├── Engine.ts
│   ├── Drone.ts
│   ├── Metronome.ts
│   ├── fx/
│   │   ├── FXChain.ts
│   │   ├── LowPass.ts
│   │   └── Reverb.ts
│   └── sounds/      # Cello, Drums, Horns
├── components/      # Svelte UI components
│   ├── DroneControl.svelte
│   ├── MetronomeControl.svelte
│   ├── FilterPanel.svelte
│   └── ...
├── stores/          # Svelte stores for app state
│   └── audio.ts     # Reactive bridge to audio engine
├── utils/
├── App.svelte
└── main.ts

## Interface Contracts

### Audio Engine Public API

```typescript
interface AudioEngine {
  // Lifecycle
  start(): void
  stop(): void
  
  // Drone control
  setDroneFrequency(hz: number): void
  setDroneWaveform(type: OscillatorType): void
  
  // Filter control  
  setFilterCutoff(hz: number): void
  setFilterResonance(q: number): void
  
  // Metronome control
  setTempo(bpm: number): void
  setBeatNumber(beats: number): void
  setMetronomeVolume(gain: number): void
}