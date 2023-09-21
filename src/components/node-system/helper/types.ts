export type ToneObjects = {
  toneObject: {[key: string]: any;} | null
}

type ClockParams = {
  bpm: number
}

type GainParams = {
  gain: number | string;
  
};

type OscillatorParams = {
  detune: number | string;
  frequency: number | string;
};

type AMOscillatorParams = {
  detune: number | string;
  frequency: number | string;
  harmonicity: number | string;
  modulationType: string;
};

type FMOscillatorParams = {
  detune: number | string;
  frequency: number | string;
  harmonicity: number | string;
  modulationIndex: number | string;
  modulationType: string;
};

type FatOscillatorParams = {
  detune: number | string;
  frequency: number | string;
  spread: number | string
};

type LFOParams = {
  frequency: number | string
  min: number
  max: number
}

type NoiseParams = {
  noiseType: string
}

type EnvelopeParams = {
  attack: number
  decay: number
  sustain: number
  release: number
}

type OmniOscillatorParams = {
  so: OscillatorParams 
  am: AMOscillatorParams 
  fm: FMOscillatorParams
  pwm: PWMOscillatorParams
  fat: FatOscillatorParams
  pulse: PulseOscillatorParams
}

type PWMOscillatorParams = {
  detune: number | string;
  frequency: number | string;
  modulationFrequency: number | string;
};

type PulseOscillatorParams = {
  detune: number | string;
  frequency: number | string;
  width: number | string;
}

type SynthParams = {
  detune: number
  frequenecy: number | string 
  portamento: number
  oscillator: OmniOscillatorParams
  envelope: EnvelopeParams
}

type AMSynthParams = {
  oscillator: OmniOscillatorParams
  modulation: OmniOscillatorParams
  envelope: EnvelopeParams
  modulationEnvelope: EnvelopeParams
  harmonicity: number
  portamento: number

}

type FilterParams = {
  frequency: number 
  type: string
  rolloff: number
  Q: number
}


type AutoFilterParams = {
  frequency: number | string
  baseFrequency: number
  octaves: number
  depth: number
  filter: FilterParams
  wet: number
}

export type OutputParams = {
  output: number | string | [] | {}
}

type AutoPannerParams = {
  frequency: number | string
}

type BitCrusherParams = {
  bits: number
}

type ChebyshevParams = {
  order: number
  wet: number
}

type ChorusParams = {
  frequency: number | string
  delayTime: number
  depth: number
}

type DistortionParams = {
  distortion: number
  wet: number
  
}

type FrequenctShifterParams = {
  shift: number
}

type PitchShiftParams = {
  pitch: number
  wet: number
}

type AddParams = {
  addend: number
}

type GreaterThanParams = {
  value: number
  comparator: number | undefined
}

type MultiplyParams = {
  value: number
  factor: number | undefined
}

type PowParam = {
  value: number
}

type ScaleParams = {
  min: number
  max: number
}

type ScaleExpParams = {
  min: number
  max: number
  exponent: number
}

export type UnitParams = {
  audioRange: number
  bpm: number
  cents: number
  decibel: number
  degrees: number
  frequency: number | string
  gainFactor: number
  hertz: number
  normalRange: number
  positive: number
  radians: number
  samples: number
  ticks: number
  time: string | number | {}
  transportTime: string | number | {}
}

type SignalParams = {
  signalValue: number
  units: string
}

type SubtractParams = {
  value: number
  subtrahend: number
}

type AmplitudeEnvelopeParams = {
  attack: number
  decay: number
  sustain: number
  release: number
  attackCurve: string
  decayCurve: string
  releaseCurve: string
}

type AnalyserParams = {
  type: string
  size: number
  smoothing: number
}

type ChannelParams = {
  volume: number
  pan: number
}

type CompressorParams = {
  attack: number
  release: number
  threshold: number
  ratio: number
  knee: number
}

type CrossFadeParams = {
  a: undefined | null
  b: undefined | null
  fade: number
}

type EQ3Params = {
  low: number
  lowFrequency: number
  mid: number
  high: number
  highFrequency: number
  Q: number
}

type FeedbackCombFilterParams = {
  delayTime: number
  resonance: number
}

type FollowerParams = {
  smoothing: number
}

type LimiterParams = {
  threshold: number
}

type AutoWahParams = {
  sensitivity: number
}

type FeedbackDelayParams = {
  feedback: number
}

type FreeverbParams = {
  dampening: number
  roomSize: number
}

type ReverbParams = {
  decay: number
}

type MembraneSynthParams = {
  pitchDecay: number
}

type NoiseSynthParams = {
  noise: string
}

type PluckNoiseParams = {
  attackNoise: number
  dampening: number
}

export type NodeParams = GainParams | 
                        ClockParams |
                        OscillatorParams | 
                        AMOscillatorParams |
                        FMOscillatorParams |
                        FatOscillatorParams |
                        NoiseParams |
                        LFOParams |
                        OmniOscillatorParams |
                        PWMOscillatorParams |
                        PulseOscillatorParams |
                        SynthParams | 
                        AMSynthParams |
                        AutoFilterParams |
                        AutoPannerParams |
                        BitCrusherParams |
                        ChebyshevParams | 
                        ChorusParams | 
                        DistortionParams |
                        FrequenctShifterParams |
                        PitchShiftParams |
                        AddParams |
                        GreaterThanParams |
                        MultiplyParams | 
                        PowParam |
                        ScaleParams |
                        ScaleExpParams |
                        SignalParams |
                        SubtractParams |
                        AmplitudeEnvelopeParams |
                        AnalyserParams |
                        ChannelParams |
                        CompressorParams |
                        CrossFadeParams | 
                        EQ3Params |
                        FeedbackCombFilterParams |
                        FilterParams | 
                        FollowerParams | 
                        LimiterParams |
                        AutoWahParams | 
                        FeedbackDelayParams | 
                        FreeverbParams | 
                        ReverbParams |
                        MultiplyParams |
                        MembraneSynthParams |
                        NoiseSynthParams |
                        PluckNoiseParams |
                        undefined | null