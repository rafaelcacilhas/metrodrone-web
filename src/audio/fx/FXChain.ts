export class FXChain {
  public input: GainNode;
  public output: GainNode;
  
  private filters: BiquadFilterNode[];
  private distortion: WaveShaperNode;
  private reverb: ConvolverNode;

    // Has input and output nodes
    //  filter → EQ → distortion → reverb → delay
    // Exposes parameters for each effect

  constructor(context: AudioContext) {
    this.input = context.createGain();
    this.output = context.createGain();
    
    this.filters = []
    this.distortion = {} as WaveShaperNode
    this.reverb = {} as ConvolverNode
    //  input → filter → distortion → reverb → output
  }

  setParam(param: string, value: number) {
    // Map UI changes to internal node parameters
  }
}