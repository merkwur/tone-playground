// nodesData.ts
import { v4 as uuidv4 } from 'uuid';
import * as Tone from "tone"
import {ToneObjects,
        NodeParams
       } from './types';

export interface Lines {
        id: string,
        sx: number; 
        sy: number; 
        ex: number; 
        ey: number;
        from: string;
        fromOutput: string,
        to: string; 
        toInput: string
      }


export interface Nodes {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  connectedTo: string[];
  input: string[];
  output: any,
  params: NodeParams;
  lines: Lines[] | null,
  ticks: number
  Tone: ToneObjects;
}


export const nodes: Nodes[] = [];
export const lines: Lines[] = [];


export const addNode = (
  name: string,
  x: number,
  y: number,
  type: string,
  connectedTo: string[],
  output: any,
  params: NodeParams | null = getDefaultParams(name),
  lines: [] | null,
  nodes: Nodes[],
  ticks: number,
  Tone: ToneObjects | null = getToneObject(name),
): Nodes[] => {

  const id = name + ":" + uuidv4().split("-")[0];
  const newNode: Nodes = {
    id,
    name,
    x,
    y,
    type,
    connectedTo,
    input: [],
    output,
    params: params || getDefaultParams(name),
    lines,
    ticks,
    Tone: Tone || { toneObject: null }, // If no tone object is provided, initialize with null
    
  };
  const updatedNodes = [...nodes, newNode];
  return updatedNodes;
};




export const updateNodePosition = (id: string, x: number, y: number, nodes: Nodes[]): Nodes[] => {
  // console.log(id, x, y)
  return nodes.map((node) => {
    if (node.id === id) {
      return {
        ...node, 
        x,       
        y,      
      };
    }
    return node;
  });
};

export const deleteNode = (idToDelete: string, nodes: Nodes[], lines: Lines[]): [Nodes[], Lines[]] => {
  const disposedElement = nodes.find((node) => node.id === idToDelete);

  if (disposedElement?.Tone.toneObject && disposedElement?.name !== "Destination"  && disposedElement?.name !== "Transport") { 
    disposedElement?.Tone.toneObject.dispose();
  } else if (disposedElement?.name === "Transport") {
    Tone.Transport.stop()
  }

  const clearedNodes = nodes.map((node) => {
    if (Array.isArray(node.input) && node.input.includes(idToDelete) && node.type !== "Source") {
      node.input = node.input.filter((id) => id !== idToDelete);
    }
    if (Array.isArray(node.connectedTo) && node.connectedTo.includes(idToDelete)) {
      node.connectedTo = node.connectedTo.filter((id) => id !== idToDelete);
    }
    return node;
  });

  const updatedLines = lines.filter((line) => !(line.from === idToDelete || line.to === idToDelete));
  const updatedNodes = clearedNodes.filter((node) => node.id !== idToDelete);

  return [updatedNodes, updatedLines];
};



export const addConnection = (from: string, to: string, 
                              connectionType:string, nodes: Nodes[]): Nodes[] => {


  console.log(from, to)                             
  let fromOutput: Nodes | undefined, toInput: Nodes | undefined

  if (connectionType === "node2node") {
    if (from.split(":")[0] !== "Transport") {
      fromOutput = nodes.find((node) => node.id === from) as Nodes;
      toInput = nodes.find((node) => node.id === to) as Nodes;
  
  
  
      if (!fromOutput || !toInput) {
        console.log('One or both of the nodes were not found.');
        return nodes; 
      }
    
      if (fromOutput.connectedTo.includes(toInput.id)) {
        console.log("Connection has already been established")
        return nodes
      } 
  
      fromOutput?.connectedTo.push(toInput?.id)
      if (toInput?.name !== "Destination") {
        if (fromOutput.Tone.toneObject) {
          fromOutput?.Tone.toneObject.connect(toInput?.Tone.toneObject)
        }
      } else {
        if (fromOutput?.Tone.toneObject) {
          fromOutput?.Tone.toneObject.toDestination()
        }
      }
      toInput?.input.push(fromOutput?.id)
    } else {
      fromOutput = nodes.find((node) => node.id === from) as Nodes;
      toInput = nodes.find((node) => node.id === to) as Nodes;
    
        if (!fromOutput || !toInput) {
          console.log('One or both of the nodes were not found.');
          return nodes; 
        }
      
        if (fromOutput.connectedTo.includes(toInput.id)) {
          console.log("Connection has already been established")
          return nodes
        } 
        fromOutput?.connectedTo.push(toInput?.id)
        toInput?.input.push(fromOutput?.id)
  
    }



  } else if (connectionType === "node2param") {

    console.log("here we are in node to param")
    fromOutput = nodes.find((node) => node.id.split(":")[1] === from.split(":")[1]) as Nodes;
    toInput = nodes.find((node) => node.id.split(":")[1] === to.split(":")[1]) as Nodes;
    
    console.log(from, fromOutput)
    console.log(to, toInput)

    if (!fromOutput || !toInput) {
      console.log('One or both of the nodes were not found.');
      return nodes; 
    }

    if (fromOutput.connectedTo.includes(to)) {
      console.log("Connection has already been established")
      return nodes
    } 

    fromOutput?.connectedTo.push(to)
    toInput?.input.push(from)


    if (fromOutput.Tone.toneObject && toInput.Tone.toneObject){
      if (to.includes("modulationIndex")) {
        fromOutput.Tone.toneObject.connect(toInput.Tone.toneObject.modulationIndex)
      } else {
        fromOutput.Tone.toneObject.connect(toInput.Tone.toneObject[to.split(":")[0]])
      }
    }
  
  }
  
    
  const updatedNodes = nodes.map((node) => {
    if (node.id === from) {
      return fromOutput;
    } else if (node.id === to) {
      return toInput;
    } else {
      return node;
    }
  });


  return updatedNodes as Nodes[];
};


const getDefaultParams = (nodeName: string): NodeParams | null => {
  switch (nodeName) {
    case "Clock":
      return {bpm: 120}
    case 'Gain':
      return {gain: .5}
    case 'Oscillator':
      return { detune: 0, frequency: 263.61};
          case "AMOscillator":
      return { detune: 0, frequency: 263.61, harmonicity: 1., modulationType: "sine"}
    case "FMOscillator":
      return { detune: 0, frequency: 263.61, harmonicity: 1., modulationIndex: 2., modulationType: "sine"}
    case "FatOscillator":
      return { detune: 0, frequency: 263.61, spread: 40}
    case "Noise":
      return { noiseType: "pink"}
    case "PWMOscillator":
      return {detune: 0, frequency: 263.61, modulationFrequency: .1}
    case "PulseOscillator":
      return {detune: 0, frequency: 263.61, width: .1}
    case "Synth":
      return {frequency: 263.61, detune: 0, portamento: 0,
              oscillator: { so: { detune: 0, frequency: 263.61}, 
                            am: { detune: 0, frequency: 263.61, harmonicity: 1., modulationType: "sine"},
                            fm: { detune: 0, frequency: 263.61, harmonicity: 1., modulationIndex: 2., modulationType: "sine"},
                            pwm: { detune: 0, frequency: 263.61, modulationFrequency: .1 }, 
                            fat: { detune: 0, frequency: 263.61, spread: 40 },
                            pulse: {detune: 0, frequency: 263.61, width: .1}},

              
            
            }

    case 'AMSynth':
      return {oscillator: {so: { detune: 0, frequency: 263.61}, 
                            am: { detune: 0, frequency: 263.61, harmonicity: 1., modulationType: "sine"},
                            fm: { detune: 0, frequency: 263.61, harmonicity: 1., modulationIndex: 2., modulationType: "sine"},
                            pwm: { detune: 0, frequency: 263.61, modulationFrequency: .1 }, 
                            fat: { detune: 0, frequency: 263.61, spread: 40 },
                            pulse: {detune: 0, frequency: 263.61, width: .1}}, 
              modulation: { so: { detune: 0, frequency: 263.61}, 
                            am: { detune: 0, frequency: 263.61, harmonicity: 1., modulationType: "sine"},
                            fm: { detune: 0, frequency: 263.61, harmonicity: 1., modulationIndex: 2., modulationType: "sine"},
                            pwm: { detune: 0, frequency: 263.61, modulationFrequency: .1 }, 
                            fat: { detune: 0, frequency: 263.61, spread: 40 },
                            pulse: {detune: 0, frequency: 263.61, width: .1}

                          }, 
              envelope: {attack: 0, decay: 0, sustain: 0, release: 0},
              modulationEnvelope: {attack: 0, decay: 0, sustain: 0, release: 0},
              harmonicity: 0,
              portamento: 0


    }
    case 'OmniOscillator':
      return { so: { detune: 0, frequency: 263.61}, 
               am: { detune: 0, frequency: 263.61, harmonicity: 1., modulationType: "sine"},
               fm: { detune: 0, frequency: 263.61, harmonicity: 1., modulationIndex: 2., modulationType: "sine"},
               pwm: { detune: 0, frequency: 263.61, modulationFrequency: .1 }, 
               fat: { detune: 0, frequency: 263.61, spread: 40 },
               pulse: {detune: 0, frequency: 263.61, width: .1}

              }
    case 'Destination':
      return null
    case "LFO":
      return {frequency: 1, min: 1, max: 1000}

    case "AutoFilter":
      return {frequency: 1, baseFrequency: 263.61, octaves: 1, depth: 1, wet: 1,
              filter: {frequency: 263.61, type: "lowpass", rolloff: -12, Q: 1}}
    case "AutoPanner":
      return {frequency: "4n"}
    case "BitCrusher":
      return {bits: 1}
    case "Chebyshev":
      return {order: 1, wet: 1}
    case "Chorus":
      return {frequency: 1, delayTime: .2, depth: 1}
    case "Distortion":
      return {distortion: 0, wet: 1}
    case "FrequencyShifter": 
      return {shift: 0}
    case "PitchShift":
      return {pitch: 0, wet: 1}
    case "Add":
      return {addend: 0}
    case "GreaterThan":
      return {value: 0, comparator: 0}
    case "Multiply":
      return {value: 0, factor: 0}
    case "Pow":
      return {value: 0}
    case "Scale":
      return {min: 0, max: 0}
    case "ScaleExp":
      return {min: 0, max: 0, exponent: 0}
    case "Signal":
      return {signalValue: 440, units: "frequency"}
    case "Subtract":
      return {value: 0, subtrahend: 0}
    case "AmplitudeEnvelope":
      return {attack: 0, 
              decay: 0, 
              sustain: 0, 
              release: 0, 
              attackCurve: "", 
              decayCurve: "",
              releaseCurve: ""
            }
    case "Analyser":
      return {type: "", size: 128, smoothing: 0}
    case "Channel":
      return {volume: 0, pan: 0}
    case "Compressor":
      return {attack: 0, release: 0, threshold: 0, ratio: 0, knee: 0}
    case "CrossFade":
      return {a: null, b: null, fade: 0}
    case "EQ3":
      return {low: 0, lowFrequency: 0, mid: 0, high: 0, highFrequency: 0, Q: 0}
    case "Envelope":
      return {attack: 0, 
        decay: 0, 
        sustain: 0, 
        release: 0, 
        attackCurve: "", 
        decayCurve: "",
        releaseCurve: ""
      }

    case "FeedbackCombFilter":
      return {delayTime: 0, resonance: 0}
    case "Filter":
      return {frequency: 0, rolloff: 0, Q: 0, type: ""}
    case "Follower":
      return {smoothing: 0}
    case "FrequencyEnvelope":
      return {attack: 0, 
              decay: 0, 
              sustain: 0, 
              release: 0, 
              baseFrequency: 0,
              octaves: 0,
              exponent: 0,
              attackCurve: "", 
              decayCurve: "",
              releaseCurve: ""
            }
    case "Limiter":
      return {threshold: 0}
    case "AutoWah":
      return {baseFrequency: 0, octaves: 0, sensitivity: 0, Q: 0}
    case "FeedbackDelay":
      return {delayTime: 0, feedback: 0}
    case "Freeverb":
      return {dampening: 0, roomSize: 0}
    case "Phaser":
      return {frequency: 0, octaves: 0, baseFrequency: 0, Q: 0}
    case "PingPongDelay":
      return {delayTime: 0, feedback: 0}
    case "Reverb":
      return {decay: 0}
    case "Tremolo":
      return {frequency: 0, depth: 0}
    case "Vibrato":
      return {frequency: 0, depth: 0}
    case "MembraneSynth":
      return {frequency: 0, detune:0,  pitchDecay: 0, portamento: 0}
    case "MetalSynth":
      return {frequency: 0, detune:0,  harmonicity: 0, modulationIndex: 0, octaves: 0, resonance: 0, portamento: 0}
    case "NoiseSynth":
      return {noise: ""}
    case "PluckNoise":
        return {attackNoise: 0, dampening: 0, release: 0, resonance: 0}
    default:
      return null; // Return null for unknown node types or if no Params are provided
  }
};


const getToneObject = (nodeName: string): ToneObjects | null => {
  switch (nodeName) {
    case "Gain":
      return { toneObject: new Tone.Gain(.5) };
    case "Oscillator":
      return { toneObject: new Tone.Oscillator(263.61, "sine") };
    case "AMOscillator":
        return { toneObject: new Tone.AMOscillator(263.61, "sine") };
    case "FMOscillator":
        return { toneObject: new Tone.FMOscillator(263.61, "sine") };
    case "FatOscillator":
      return { toneObject: new Tone.FatOscillator(263.61, "sine", 40) }
    case "LFO":
      return { toneObject: new Tone.LFO(1, 1, 1000) };
    case "Noise":
      return { toneObject: new Tone.Noise("pink") };
    case "PWMOscillator":
      return { toneObject: new Tone.PWMOscillator(263.61, .1) };
    case "OmniOscillator":
      return { toneObject: new Tone.OmniOscillator(263.61, "pwm") };
    case "PulseOscillator":
      return { toneObject: new Tone.PulseOscillator(263.61, .1) };
    case "AMSynth":
      return { toneObject: new Tone.AMSynth() };
    case "Synth":
      return { toneObject: new Tone.Synth()}
    case "AutoFilter":
      return { toneObject: new Tone.AutoFilter(1, 263.61, 1) }
    case "AutoPanner":
      return { toneObject: new Tone.AutoPanner("1n") }
    case "BitCrusher":
      return {toneObject: new Tone.BitCrusher(1) }
    case "Chebyshev":
      return {toneObject: new Tone.Chebyshev(1)}
    case "Chorus":
      return {toneObject: new Tone.Chorus(1, .25, 1)}
    case "Distortion":
      return {toneObject: new Tone.Distortion(0)}
    case "FrequencyShifter": 
      return {toneObject: new Tone.FrequencyShifter(0)} 
    case "PitchShift":
      return {toneObject: new Tone.PitchShift(0)}
    case "Abs":
      return {toneObject: new Tone.Abs()}
    case "Add":
      return {toneObject: new Tone.Add()}
    case "AudioToGain":
      return {toneObject: new Tone.AudioToGain()}
    case "GainToAudio":
      return {toneObject: new Tone.GainToAudio()}
    case "GreaterThan":
      return {toneObject: new Tone.GreaterThan(0)}
    case "GreaterThanZero":
      return {toneObject: new Tone.GreaterThanZero()}
    case "Multiply":
      return {toneObject: new Tone.Multiply(1)}
    case "Negate":
      return {toneObject: new Tone.Negate()}
    case "Pow":
      return {toneObject: new Tone.Pow(1)}
    case "Scale":
      return {toneObject: new Tone.Scale(0, 1)}
    case "ScaleExp":
      return {toneObject: new Tone.ScaleExp(0, 1, 1)}
    case "Signal":
      return {toneObject: new Tone.Signal(440, "frequency")}
    case "Subtract":
      return {toneObject: new Tone.Subtract(0)}
    case "AmplitudeEnvelope":
      return {toneObject: new Tone.AmplitudeEnvelope(.1, .2, .5, .6)}
    case "Analyser": 
      return {toneObject: new Tone.Analyser("waveform", 128)}
    case "Channel": 
      return {toneObject: new Tone.Channel(12, 0)}
    case "Compressor": 
      return {toneObject: new Tone.Compressor(-12, 5)}
    case "CrossFade": 
      return {toneObject: new Tone.CrossFade(0)}
    case "EQ3": 
      return {toneObject: new Tone.EQ3(0, 0, 0)}
    case "Envelope": 
      return {toneObject: new Tone.Envelope(.1, .2, .5, .6)}
    case "FeedbackCombFilter": 
      return {toneObject: new Tone.FeedbackCombFilter(.1, .2)}
    case "Filter": 
      return {toneObject: new Tone.Filter(263.61, "lowpass")}
    case "Follower": 
      return {toneObject: new Tone.Follower(.25)}
    case "FrequencyEnvelope": 
      return {toneObject: new Tone.FrequencyEnvelope(.1, .2, .5, .6)}
    case "Limiter": 
      return {toneObject: new Tone.Limiter(-12)}
    case "AutoWah": 
      return {toneObject: new Tone.AutoWah(123, 1)}
    case "FeedbackDelay": 
      return {toneObject: new Tone.FeedbackDelay(.25, .5)}
    case "Freeverb": 
      return {toneObject: new Tone.FeedbackDelay(.5, .5)}
    case "Phaser": 
      return {toneObject: new Tone.Phaser(263.6, 0, 263.6)}
    case "PingPongDelay": 
      return {toneObject: new Tone.PingPongDelay(.25, .5)}
    case "Reverb": 
      return {toneObject: new Tone.Reverb(.78)}
    case "Tremolo": 
      return {toneObject: new Tone.Tremolo(5, 1)}
    case "Vibrato": 
      return {toneObject: new Tone.Vibrato(5, 1)}
    case "MembraneSynth": 
      return {toneObject: new Tone.MembraneSynth({pitchDecay: 0})}
    case "MetalSynth": 
      return {toneObject: new Tone.MetalSynth()}
    case "NoiseSynth": 
      return {toneObject: new Tone.NoiseSynth()}
    case "PluckSynth": 
      return {toneObject: new Tone.PluckSynth()}
    default:
      return null; // Return null for unknown node types or if no tone object is provided
  }
};


export const addLine = (
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  from: string,
  fromOutput: string,
  to: string,
  toInput: string,
  lines: Lines[]
): Lines[] => {
  const id = "line" + ":" + uuidv4().split("-")[0];

  const lineExists = lines.some(
    (line) =>
      line.from === from &&
      line.fromOutput === fromOutput &&
      line.to === to &&
      line.toInput === toInput
  );

  if (!lineExists) {
    const newLine: Lines = {
      id,
      sx,
      sy,
      ex,
      ey,
      from,
      fromOutput,
      to,
      toInput,
    };

    const updateLines = [...lines, newLine];
    return updateLines;
  } else {

    return lines;
  }
};


export const updateLinePositions = (nodeID: string, x: number, y: number, lines: Lines[]): Lines[] => {
  
  return lines.map((line) => {
    if (nodeID === line.from) {
  
      // Update lines where the node is the source (output)
      return {
        ...line,
        sx: x + line.sx,
        sy: y + line.sy,
      };
    } else if (nodeID === line.to) {
  
      // Update lines where the node is the source (output)
      return {
        ...line,
        ex: x + line.ex,
        ey: y + line.ey,
      };
    }
    return line; // Return other lines unchanged
  });
};

export const updateLinePositionsFromNodeChange = (nodeID: string, x: number, y: number, lines: Lines[]): Lines[] => {
  
  return lines.map((line) => {
    if (nodeID === line.from) {
  
      // Update lines where the node is the source (output)
      return {
        ...line,
        sx: x,
        sy: y 
      };
    } else if (nodeID === line.to) {
  
      // Update lines where the node is the source (output)
      return {
        ...line,
        ex: x, 
        ey: y 
      };
    }
    return line; // Return other lines unchanged
  });
};


export const deleteLine = (lineID: string, lines: Lines[], nodes: Nodes[]): [Lines[], Nodes[]] => {
  const deletedLine = lines.find((line) => line.id === lineID);

  if (!deletedLine) {
    // If the line to delete is not found, return the original arrays
    return [lines, nodes];
  }

  let fromNode: any;
  let toNode: any;


  const updatedNodes = nodes.map((node) => {
    if (deletedLine.from === node.id) {
      node.connectedTo = node.connectedTo.filter((id) => id.split(":")[1] !== deletedLine.to.split(":")[1]);
      fromNode = node;
    }
    if (deletedLine.to === node.id) {
      node.input = node.input.filter((id) => id.split(":")[1] !== deletedLine.from.split(":")[1]);
      toNode = node;
    }
    return node;
  });
  
  if (fromNode && toNode) {
    if (fromNode.name !== "Transport") {
      if (deletedLine.toInput.split(":")[0] !== "input") {
        console.log(fromNode.Tone.toneObject.numberOfInput)
        console.log(deletedLine.toInput.split(":")[0])
        fromNode.Tone.toneObject.disconnect(toNode.Tone.toneObject[deletedLine.toInput.split(":")[0]]);
      } else {
        
        fromNode.Tone.toneObject.disconnect(toNode.Tone.toneObject);
      }
    }
      
  }

  const updatedLines = lines.filter((line) => line.id !== lineID);

  return [updatedLines, updatedNodes];
};













