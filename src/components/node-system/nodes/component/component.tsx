import React, { useEffect, useState } from 'react'
import "./component.scss"
import Forms from '../instrument/form/forms'

interface ComponentType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          lines: [],
          params: {},
          Tone: any 
      }
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const posY = 45
const posYMultiplier = 30
const attackRelaseCurves = ["linear",
                            "exponential",
                            "sine",
                            "cosine",
                            "bounce",
                            "ripple",
                            "step"]
const decayCurves = ["linear",
                     "exponential"]

const filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]
const rolloffs = [-12, -24, -48, -96]

const initialStates = {
                        attack: {value: .1, min: 0, max: 1, multiplier: .001, toneExtension: false},
                        decay: {value: .2, min: 0, max: 1, multiplier: .001, toneExtension: false},
                        sustain: {value: .5, min: 0, max: 1, multiplier: .001, toneExtension: false},
                        release: {value: .6, min: 0, max: 1, multiplier: .001, toneExtension: false},
                        attackCurve : {value: "linear", toneExtension: false},
                        decayCurve : {value: "linear", toneExtension: false},
                        releaseCurve : {value: "linear", toneExtension: false},
                        volume: {value: 12, min: 0, max: 120, multiplier: 1, toneExtension: true},
                        pan: {value: 0, min: -1, max: 1, multiplier: .001, toneExtension: true},
                        threshold: {value: -12, min: -100, max: 0, multiplier: 1, toneExtension: true},
                        ratio: {value: 5, min: 1, max: 20, multiplier: 1, toneExtension: true},
                        knee: {value: 8, min: 0, max: 40, multiplier: 1, toneExtension: true},
                        fade: {value: 0, min: 0, max: 1, multiplier: .001, toneExtension: true},
                        low: {value: 0, min: -12, max: 12, multiplier: 1, toneExtension: true},
                        lowFrequency: {value: 60, min: 20, max: 420, multiplier: 1, toneExtension: true},
                        mid: {value: 0, min: -12, max: 12, multiplier: 1, toneExtension: true}, 
                        high: {value: 0, min: -12, max: 12, multiplier: 1, toneExtension: true},
                        highFrequency: {value: 4096, min: 1024, max: 8192, multiplier: 1, toneExtension: true},
                        Q: {value: 2, min: 1, max: 42, multiplier: .1, toneExtension: true},
                        delayTime: {value: .1, min: 0, max: .999, multiplier: .001, toneExtension: true},
                        resonance: {value: .2, min: 0, max: 1, multiplier: .001, toneExtension: true},
                        frequency: {value: 263.6, min: 20, max: 8196, multiplier: .1, toneExtension: true},
                        type: {value: "lowpass", toneExtension: false},
                        rolloff: {value: -12, noClamp: true, toneExtension: false},
                        smoothing: {value: .25, min: 0.01, max: 1, multiplier: .001, toneExtension: false},
                        octaves: {value: 1, min: -4, max: 4, multiplier: 1, toneExtension: false},
                        exponent: {value: 1, min: 0.01, max: 5, multiplier: .01, toneExtension: false},
                        baseFrequency: {value: 263.6, min: 20, max: 1024, multiplier: .1, toneExtension: false},


} as any            



const Component: React.FC<ComponentType> = ({name, node}) => {
  
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [state, setState] = useState<{}>(initialStates) as any

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [k, setK] = useState<string>("frequency")
  const [initialX, setInitialX] = useState<number>(0)


  useEffect(() => {
    if(node.params && Object.keys(node.params).length > 0) {
      setNodeHeight(Object.keys(node.params).length * posYMultiplier + posY)
    } else {
      setNodeHeight(80)
    }
  }, [])


  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  

  const handleMouseMove = (event: MouseEvent) => {
    
    if (isDragging) {
      const difference = event.clientX - initialX!
      const parameter = initialStates[k]
      
      if (k?.includes("rolloff")) {
        const value = rolloffs[clamp(Math.floor(difference*.01) % rolloffs.length, 0, Infinity)]
        setState((prevState: any) => ({
          ...prevState,
          [k]: { ...prevState[k], value: value },
        }));
        handleNodeValueChange(value, k);
      } else {
          const clampedValue = clamp(state[k].value + difference * parameter.multiplier, parameter.min, parameter.max);
          setState((prevState: any) => ({
            ...prevState,
            [k]: { ...prevState[k], value: clampedValue },
          }));
          handleNodeValueChange(clampedValue, k);
      }


    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }


const handleNodeValueChange = (value: number | string, type: string) => {
  if (initialStates[type].toneExtension) {
    node.Tone.toneObject[type].value = value
  } else {
    if (node.name === "Compressor") {
      node.Tone.toneObject[type].value = value
    } else {
      node.Tone.toneObject[type] = value
    }
  }
}


const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
  if (event && "target" in event) {
      const target = event.target as any
      if (target && "id" in target && "value" in target) {
        const id = target.id as string
        const value = target.value as string
  
          if (id === "attackCurve") {
            handleNodeValueChange(value, "attackCurve")
          }
          if (id === "decayCurve") {
      
            handleNodeValueChange(value, "decayCurve")
          }
          if (id === "releaseCurve") {
            handleNodeValueChange(value, "releaseCurve")
          }
          if (id === "type") {
            handleNodeValueChange(value, "type")
          }
      }
    }
  }


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
      className="component-node-body"
      style={{height: `${nodeHeight}px`}}
      key={"Component"+node.id}
      id={node.id}
      >
      <div 
        className='header'
        key={"header"+node.id}
      > {name.includes("Amplitude") ? "AmpEnv" 
        : name.includes("FeedbackComb") ? "FCF"
        : name.includes("FrequencyEnvelope") ? "FreqEnv"
        : name} </div>

        
        <div
            key={"output" + node.id}
            className='output'
            style={{position: "absolute", right: "0px", bottom: "0px"}}
            id={"output:"+node.id.split(":")[1]}
            title={node.id}
          >  </div>
          
        <div
          className='input'
          style={{ position: "absolute", left: "0px", bottom: "0px" }}
          id={"input"+":"+node.id.split(":")[1]}
          title={node.id}
        ></div> 
            
        {Object.keys(node.params).map((key, index) => (
          <React.Fragment key={`input-${key}-${index}`}>
            {!key.includes("Curve") && !key.includes("type") ? (
              <>
                <div
                  className='input'
                  style={{ position: "absolute", 
                            left: "0px", top: `${posY + posYMultiplier * index}px`,
                            borderRadius: "50%"
                          }}
                  id={key+":"+node.id.split(":")[1]}
                  title={node.id}> </div>
                <div 
                    className='label' 
                    key={`inner-text-${key}-${index}`}
                    style={{position: "absolute", left: "15px", top: `${posY - 15 + posYMultiplier * index}px`}}
                  > {key} </div>
                  {key !== "a" && key !== "b" ? (
                   <>
                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${posY - 1 + posYMultiplier * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}`}
                        >
                    <div 
                        className='inner-text' 
                        key={`inner-text-${key}-${index}`}
                        > { typeof(state[key].value) === "number" ?  
                          state[key].value.toFixed(3) 
                          : null

                          } </div>
                  </div>
                   </>
                  ) : null}
              </>
            ) : (
              <>
                <div 
                className='label' 
                key={`inner-text-${key}-${index}`}
                style={{position: "absolute", left: "15px", top: `${posY - 15 + posYMultiplier * index}px`}}
              > {key} </div>
                <Forms 
                    id={node.id} 
                    handleSourceChange={handleChange} 
                    content={key.includes("type") ? filterTypes 
                             : !key.includes("decay") ? attackRelaseCurves 
                             : decayCurves}
                    type={key}
                    position={{top: `${posY -1 + posYMultiplier * index}`, left: 15}}           
                />
              </>
            )}
          </React.Fragment>
        ))}
      
    </div>
  </>
  )
}

export default Component
