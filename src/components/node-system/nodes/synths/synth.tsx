import React, { useEffect, useState } from 'react'
import Forms from '../instrument/form/forms'
import Envelope from '../instrument/envelope/envelope'

import "./synth.scss"
import { NodeParams } from '../../helper/types'

interface SynthType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          lines: [],
          params: NodeParams | any,
          Tone: any 
      }
      
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
// const posY = 80
const sourcekey = ["so", "am", "fm", "fat", "pwm", "pulse"]
// const sourcekeyHeader = ["SimpleOsc", "AMOsc", "FMOsc", "FatOsc", "PWMOsc", "PulseOsc"]
const wavekey = ["sine", "square", "sawtooth", "tringle"]
// const curveType = [ "linear",
//                     "exponential",
//                     "sine",
//                     "cosine",
//                     "bounce",
//                     "ripple",
//                     "step"]
const excludes = ["MembraneSynth", "MetalSynth", "NoiseSynth"]

const initialStates = { 
                        attack:           {value: .1,     min: 0,     max: 1,     multiplier: .001             },
                        decay:            {value: .2,     min: 0,     max: 1,     multiplier: .001             },
                        sustain:          {value: .5,     min: 0,     max: 1,     multiplier: .001             },
                        release:          {value: .6,     min: 0,     max: 1,     multiplier: .001             },
                        detune:           {value:  0,     min: -1200, max: 1200,  multiplier:  1               },
                        portamento:       {value:  0,     min: 0,     max: 1,     multiplier: .001             },
                        frequency:        {value:  263.6, min: 20,    max: 8192,  multiplier: .1               },
                        pitchDecay:       {value:  0,     min: 0,     max: 1,     multiplier: .001             },
                        harmonicity:      {value:  1,     min: .1,    max: 10,    multiplier: .001             },
                        octaves:          {value:  0,     min: 0,     max: 8,     multiplier: .001             },
                        resonance:        {value:  0,     min: 0,     max: 7000,  multiplier:  1               },
                        modulationIndex:  {value:  1,     min: 1,     max: 100,   multiplier:  1               },
                        dampening:        {value:  1,     min: 1,     max: 7000,  multiplier:  1               },
                        noise:            {value:  "brown", types: ["pink", "white", "brown"], multiplier:  .01},
                        attackCurve :     {value: "linear"},
                        decayCurve :      {value: "linear"},
                        releaseCurve :    {value: "linear"},
                      } as any


const Synth: React.FC<SynthType> = ({name, node}) => {
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [initialX, setInitialX] = useState<number>(0)
  const [state, setState] = useState<{}>(initialStates) as any
  const [oscillatorType, setOscillatorType] = useState<string>("so")
  const [k, setK] = useState<string | null>(null)
  

  useEffect(() => {
    if (!excludes.includes(node.name)) {
      setNodeHeight(Object.keys(node.params["oscillator"][oscillatorType]).length * 32 + 200)
    } else {
      setNodeHeight(Object.keys(node.params).length * 32 + 170)
    }
  }, [oscillatorType])




  // const handleEnvelopeChange = (value: number, type: string) => {

  // }

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (event && "target" in event) {
      const target = event.target as any
      if (target) {
        setOscillatorType(target.value)
      }
    }
    
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  

  const handleMouseMove = (event: MouseEvent) => {
    
    if (isDragging && k) {
      const difference = event.clientX - initialX!
      const parameter = initialStates[k]

      if (!k?.includes("type")) {
        const clampedValue = clamp(state[k].value + difference * parameter.multiplier, parameter.min, parameter.max);
        setState((prevState: any) => ({
          ...prevState,
          [k]: { ...prevState[k], value: clampedValue },
        }));
        handleNodeValueChange(clampedValue, k);
      } else {
        const selectedValue = state[k].types[clamp(Math.floor(difference * parameter.multiplier) % state[k].types.length, 0, state[k].types.length)];
        setState((prevState: any) => ({
          ...prevState,
          [k]: { ...prevState[k], value: selectedValue },
        }));
        handleNodeValueChange(selectedValue, k);
      }



    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleNodeValueChange = (val: number | string, type: string) => {
    console.log(val, type)
    if (node.name !== "NoiseSynth") {
      if (node.Tone.toneObject[type].hasOwnProperty(val)) {
          node.Tone.toneObject[type].value = val
        } else {
          node.Tone.toneObject[type] = val
        }
      } else {
        node.Tone.toneObject[type] = val 
        
      }
    } 



  // const handleChange = (event: MouseEvent) => {
  //   if (event?.target?.id === "attackCurve") {
  //     handleNodeValueChange(event.target.value, "attackCurve")
  //   }
  //   if (event?.target?.id === "decayCurve") {

  //     handleNodeValueChange(event.target.value, "decayCurve")
  //   }
  //   if (event?.target?.id === "releaseCurve") {
  //     handleNodeValueChange(event.target.value, "releaseCurve")
  //   }
  //   if (event?.target?.id === "type") {
  //     handleNodeValueChange(event.target.value, "type")
  //   }
  // }


  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);


  return (
    <>
      <div 
        className="synth-node-body"
        style={{height: `${nodeHeight}px`,
                width: `${160}px`
              }}
        key={"synth"+node.id}
        id={node.id} > <div 
              className='header'
              key={"header"+node.id}
      > {name} </div>


      <div
          key={"output"+node.id}
          className='output'
          id={"output:"+node.id.split(":")[1]}
          style={{position: "absolute", right: "0px", bottom: "0px"}}
          title={node.id}
      >  </div>

        <div
            key={"input"+node.id}
            className='input'
            id={"input:"+node.id.split(":")[1]}
            style={{position: "absolute", left: "0px", bottom: "0px"}}
            // onClick={handleTrigger}
            title={node.id}
        >  </div>

        <div 
            className='oscillator'
            style={{position: "absolute",
                    left: "0%", top: "0",
                    fontSize: "8pt", color: "#777", width: "100%"
                  }}
        > 
        <div 
          className='form-container'
          style={{position: "absolute", 
                  top: "25px", left: "0px",  
                  height:"100%", width: "100%",
                  // border: "1px solid #ff4242"
                }}
          >
          <Forms 
            id={node.id} 
            handleSourceChange={handleChange} 
            content={sourcekey}
            type={"source oscillator"}
            position={{top: 0, left: 0}}
          />
          <Forms 
            id={node.id} 
            handleSourceChange={handleChange} 
            content={wavekey}
            type={"wave modulation"}
            position={{top: 0, left: 100}}
          />
          <Envelope 
              type='synth'
              // updateEnvelope = {(value, type) => handleEnvelopeChange(value, type)}
              />
        </div>
        <div 
            className='parameters'
            style={{ position: "absolute", left: "0px", top: "105px",
                      height: "100%", width: "100%"
                    }}
        >

          {Object.keys(node.params).map((key, index) => (
            <React.Fragment key={key}>
              {key !== "envelope" && key !== "oscillator" && key !== "noise" ? (
                <React.Fragment key={key}>
                  <div
                      className='input'
                      style={{ position: "absolute", left: "0px", top: `${50 + 32 * index}px`,
                              borderRadius: "50%"
                            }}
                      id={key+":"+node.id.split(":")[1]}
                      title={node.id}
                      ></div>

                    <div 
                        key={key}
                        style={{position: "absolute", 
                                left: `${15}px`, top: `${38 + 32 * index}px`,
                                
                                fontSize: "7pt",
                                fontWeight: "500"
                        
                              }}
                      > {`${key !== "portamento" ? key : "glide"}`} </div>
                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${50 + 32 * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}-oscillator`}

                    > <div className='inner-text' key={`inner-text-${key}-${index}-oscillator`}>
                        { typeof state[key].value === "string" ? state[key].value :
                          state[key].value.toFixed(3)
                        } 
                      </div>
                    </div>
                </React.Fragment>
              ) : null }
            </React.Fragment>
            ))}
        </div>


      </div>
      </div>
    </>
  )
}

export default Synth






