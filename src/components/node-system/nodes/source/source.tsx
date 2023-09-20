import React, { useEffect, useRef, useState } from 'react'
import { Nodes } from '../../helper/nodeData'
import "./source.scss"

interface SourceType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: [],
          params: {},
          lines: [],
          Tone: {} 
      }
  }

cosnt 

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const modulationTypes = ["sine", "square", "sawtooth", "triangle"]
const noiseTypes = ["white", "pink", "brown"]

const Source: React.FC<SourceType> = ({name, node}) => {

  const [startOsc, setStartOsc] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [detuneValue, setDetuneValue] = useState(0.0)
  const [frequencyValue, setFrequencyValue] = useState(263.6)
  const [waveType, setWaveType] = useState<string>("sine")
  const [harmonicityValue, setHarmonicityValue] = useState<number>(1)
  const [modulationType, setModulationType] = useState<string>("square")
  const [lfoMinValue, setLfoMinValue] = useState<number>(1)
  const [lfoMaxValue, setLfoMaxValue] = useState<number>(1000)
  const [lfoFrequencyValue, setLfoFrequencyValue] = useState<number>(1)
  const [modulationIndex, setModulationIndex] = useState<number>(2)
  const [spread, setSpread] = useState<number>(40)
  const [noiseType, setNoiseType] = useState<string>("pink")
  const [modulationFrequency, setModulationFrequency] = useState<number>(.1)
  const [pulseWidth, setPulseWidth] = useState<number>(.5)
  const [sourceType, setSourceType] = useState<string>("so")

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [initialX, setInitialX] = useState<number>(0)
  const [k, setK] = useState<string | null>("")
  const firstRender = useRef(true);


  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (startOsc) {
        node.Tone.toneObject.start()
      } else {
        node.Tone.toneObject.stop()
      }
    }

  }, [startOsc])


  const handleDropdownChange = (event: MouseEvent) => {
    setWaveType(event.target?.value)
  }

  const handleSourceChange = (event: MouseEvent) => {
    setSourceType(event.target?.value)
  }

  useEffect(() => {
    if (name === "OmniOscillator") {
      setNodeHeight(Object.keys(node.params[sourceType]).length * 40 + 80)
    } else if (name !== "Noise") {
      setNodeHeight(Object.keys(node.params).length * 40 + 80)
    } else {
      setNodeHeight(Object.keys(node.params).length * 40 + 40)
    }

    if (name === "PWMOscillator") {
      setWaveType("pwm")
    }

    if (name === "PulseOscillator") {
      setWaveType("pulse")
    }

  }, [sourceType])


  const handleMouseDown = (event: MouseEvent, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const difference = event.clientX - initialX!
      if (k.includes("frequency")) {
        if (name === "LFO") {
          setLfoFrequencyValue(clamp(lfoFrequencyValue + difference/100, .01, 10))  
        } else {
          setFrequencyValue(clamp(frequencyValue + difference*.1, 10, 12000))
        }
      }
      if (k.includes("detune")) {
        setDetuneValue(clamp(Math.floor(detuneValue + difference), -1200, 1200))
      }
      if (k.includes("harmonicity")) {
        setHarmonicityValue(clamp(harmonicityValue + difference/100, .01, 10))
      }
      if (k.includes("modulationType")) {
        setModulationType(modulationTypes[Math.floor(Math.abs(difference) / 50) % 4])
      }
      if (k.includes("min")) {
        setLfoMinValue(clamp(lfoMinValue + difference/100, .001, 10))
      }
      
      if (k.includes("max")) {
        setLfoMaxValue(clamp(Math.floor(lfoMaxValue + difference), lfoMinValue, 12000))
      }
      if (k.includes("modulationIndex")) {
        setModulationIndex(clamp(modulationIndex + difference*.1, .1, 4000))
      }
      if (k.includes("spread")) {
        setSpread(clamp(Math.floor(spread + difference), 1, 1199))
      }
      if (k?.includes("noiseType")) {
        setNoiseType(noiseTypes[Math.floor(Math.abs(difference) / 50) % 3])
      }
      if (k?.includes("modulationFrequency")) {
        setModulationFrequency(clamp(modulationFrequency + difference*.001, .1, 5))
      }
      if (k?.includes("width")) {
        setPulseWidth(clamp(pulseWidth + difference*.01, .1, 1))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }


  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(frequencyValue, "frequency")
    }
  }, [frequencyValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(lfoFrequencyValue, "LFOFrequency")
    }
  }, [lfoFrequencyValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(detuneValue, "detune")
    }
  }, [detuneValue])

  useEffect(() => {
    console.log(name)
    if (waveType && name !== "PWMOscillator") {
      handleNodeValueChange(waveType, "waveType")
    }
  }, [waveType])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(harmonicityValue, "harmonicity")
    }
  }, [harmonicityValue])

  useEffect(() => {
    if (isDragging) {      
      handleNodeValueChange(modulationType, "modulationType")
    }
  }, [modulationType])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(lfoMaxValue, "max")
    }
  }, [lfoMaxValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(lfoMinValue, "min")
    }
  }, [lfoMinValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modulationIndex, "modulationIndex")
    }
  }, [modulationIndex])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(spread, "spread")
    }
  }, [spread])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(noiseType, "noiseType")
    }
  }, [noiseType])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modulationFrequency, "modulationFrequency")
    }    
  }, [modulationFrequency])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(pulseWidth, "width")
    }    
  }, [pulseWidth])


  const handleNodeValueChange = (value: number | string, type: string) => {

    switch (type) {
      case "frequency":
        node.Tone.toneObject.frequency.value = value;
        break
      case "LFOFrequency":
        node.Tone.toneObject.frequency.value = value;
        break
      case "detune":
        node.Tone.toneObject.detune.set({value: value});
        break
      case "waveType":
        if (name !== "Noise" && name !== "PWMOscillator" && name !== "PulseOscillator") {
          node.Tone.toneObject.type = waveType
        }
        break
      case "harmonicity":
        node.Tone.toneObject.harmonicity.value = harmonicityValue
        break
      case "modulationType":
        node.Tone.toneObject.modulationType = modulationType
        break
      case "min":
        node.Tone.toneObject.min = lfoMinValue
        break
      case "max":
        node.Tone.toneObject.max = lfoMaxValue
        break
      case "modulationIndex":
        node.Tone.toneObject.modulationIndex.value = modulationIndex
        break
      case "spread":
        node.Tone.toneObject.spread = spread
        break
      case "noiseType":
        node.Tone.toneObject.type = noiseType
        break
      case "modulationFrequency":
        node.Tone.toneObject.modulationFrequency.value = modulationFrequency
        break
      case "width":
        node.Tone.toneObject.width.value = pulseWidth
        break
    }
  };

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
    
      <div 
        className="source-node-body"
        style={{height: `${nodeHeight}px`}}
        key={"source"+node.id}
        id={node.id}
        >
        <div 
          className='header'
          key={"header"+node.id}
        > {name} </div>

        {name !== "Noise" && name !== "PWMOscillator" && name !== "PulseOscillator" ? (
          <div 
            className='form-source'
            style={{position: "absolute", top: "26px", left: "10px"}}
            key={"form"+node.id}
            >
            <select 
              key={"select"+node.id}
              name="wave-table" 
              id={"waveTable"+node.id}
              onChange={(event) => handleDropdownChange(event)} 
              style={{outline: "none", 
                      border: "none",
                      height: "15px",
                      width: "100%",
                      display: 'flex',
                      color: "#777",
                      fontSize: "7pt",
                      backgroundColor: "#121212"
                    }}
              >
              <option 
                className='options' 
                value="sine"
                > sine </option>
              <option 
                className='options' 
                value="square"
                >square</option>
              <option 
                className='options' 
                value="sawtooth"
                >sawtooth</option>
              <option 
                className='options' 
                value="triangle"
                >triangle</option>
            </select>
          </div>
            
          
        ) : (
         null
        )}
        <div 
            key={"startStop"+node.id}
            className='start-stop'
            onClick={() => setStartOsc(!startOsc)}
            style={{backgroundColor: `${startOsc ? "#42ff42" : "#aa4242"}`}}
          >
        </div>

        <div
            key={"output"+node.id}
            className='output'
            id={"output:"+node.id.split(":")[1]}
            style={{position: "absolute", right: "0px", bottom: "0px"}}
            title={node.id}
        >  </div>
        
        {name !== "OmniOscillator" ? (
          <>
            {Object.keys(node.params).map((key, index) => (
              <React.Fragment key={`input-${key}-${index}`}>
                {name !== "Noise" ? (
                  <>
                    <div
                        className='input'
                        style={{ position: "absolute", left: "0px", top: `${80 + 40 * index}px`,
                                borderRadius: "50%"
                              }}
                        id={key+":"+node.id.split(":")[1]}
                        title={node.id}
                    ></div>

                    <div 
                        className='label' 
                        key={`label-${key}-${index}`}
                        style={{position: "absolute", left: "15px", top: `${62 + 40 * index}px`}}
                    > {key} </div>

                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${79 + 40 * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}`}
                    >
                      <div className='inner-text' key={`inner-text-${key}-${index}`}>
                        { key === "frequency" && name !== "LFO" ? frequencyValue.toFixed(2) :
                          key === "frequency" && name === "LFO" ? lfoFrequencyValue.toFixed(3) :
                          key === "detune" ? detuneValue :
                          key === "harmonicity" ? harmonicityValue.toFixed(3) :
                          key === "min" ? lfoMinValue.toFixed(3) :
                          key === "max" ? lfoMaxValue.toFixed(3) :
                          key === "modulationIndex" ? modulationIndex.toFixed(2) :
                          key === "spread" ? spread :
                          key === "modulationFrequency" ? modulationFrequency.toFixed(3) :
                          key === "width" ? pulseWidth.toFixed(3) :
                          modulationType
                        } 
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div 
                        className='label' 
                        key={`label-${key}-${index}`}
                        style={{position: "absolute", left: "15px", top: `${32 + 40 * index}px`}}
                    > {key} </div>

                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${48 + 40 * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}`}
                    > <div 
                          className='inner-text' 
                          key={`inner-text-${key}-${index}`}
                          > { noiseType } </div> </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            {name === "OmniOscillator"? (
              <div 
                className='form'
                style={{position: "absolute", bottom: "6px", left: "10px"}}
                key={"form"+node.id}
                >
                <select 
                  key={"select"+node.id}
                  name="sourceType" 
                  id={"source-type"+node.id}
                  onChange={(event) => handleSourceChange(event)} 
                  style={{outline: "none", 
                          border: "none",
                          height: "15px",
                          width: "100%",
                          display: 'flex',
                          color: "#777",
                          fontSize: "7pt",
                          backgroundColor: "#121212"
                        }}
                  >
                  <option 
                    className='options' 
                    value="so"
                    > simple osc </option>
                  <option 
                    className='options' 
                    value="am"
                    >AMOsc</option>
                  <option 
                    className='options' 
                    value="fm"
                    >FMOsc</option>
                  <option 
                    className='options' 
                    value="fat"
                    >FatOsc</option>
                  <option 
                    className='options' 
                    value="pwm"
                    >PWMOsc</option>
                  <option 
                    className='options' 
                    value="pulse"
                    >PulseOsc</option>
                </select>
              </div>
                
              
            ) : (
            null
          )}
          {Object.keys(node.params[sourceType]).map((key, index) => (
              <React.Fragment key={`input-${key}-${index}`}>
                {name !== "Noise" ? (
                  <>
                    <div
                        className='input'
                        style={{ position: "absolute", left: "0px", top: `${80 + 40 * index}px`,
                                borderRadius: "50%"
                              }}
                        id={key+":"+node.id.split(":")[1]}
                        title={node.id}
                    ></div>

                    <div 
                        className='label' 
                        key={`label-${key}-${index}`}
                        style={{position: "absolute", left: "15px", top: `${62 + 40 * index}px`}}
                    > {key} </div>

                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${79 + 40 * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}`}
                    >
                      <div className='inner-text' key={`inner-text-${key}-${index}`}>
                        { key === "frequency" && name !== "LFO" ? frequencyValue.toFixed(3) :
                          key === "frequency" && name === "LFO" ? lfoFrequencyValue.toFixed(3) :
                          key === "detune" ? detuneValue :
                          key === "harmonicity" ? harmonicityValue.toFixed(3) :
                          key === "min" ? lfoMinValue.toFixed(3) :
                          key === "max" ? lfoMaxValue.toFixed(3) :
                          key === "modulationIndex" ? modulationIndex.toFixed(2) :
                          key === "spread" ? spread :
                          key === "modulationFrequency" ? modulationFrequency.toFixed(3) :
                          key === "width" ? pulseWidth.toFixed(3) :
                          modulationType
                        } 
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div 
                        className='label' 
                        key={`label-${key}-${index}`}
                        style={{position: "absolute", left: "15px", top: `${32 + 40 * index}px`}}
                    > {key} </div>

                    <div
                        className={"slider"}
                        onMouseDown={(event) => handleMouseDown(event, key)}
                        style={{
                          position: "absolute",
                          top: `${48 + 40 * index}px`,
                          left: "15px",
                        }}
                        key={`slider-${key}-${index}`}
                    > <div 
                          className='inner-text' 
                          key={`inner-text-${key}-${index}`}
                          > { noiseType } </div> </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </>
        )}


      </div>
    
  )
}

export default Source


