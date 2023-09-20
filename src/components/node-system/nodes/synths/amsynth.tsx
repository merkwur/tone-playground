import React, { useEffect, useRef, useState } from 'react'
import "./AMSynth.scss"
import Forms from './form/forms'
import Envelope from './envelope/envelope'
import { Lines, NodeParam } from '../../helper/nodeData'

interface AMSynthType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          lines: [],
          params: NodeParam,
          Tone: {} 
      }
      lines: {
          sx: number, 
          sy: number,
          ex: number,
          ey: number, 
          from: string,
          to: string,
          fromOutput: string,
          toInput: string
      } | null
      
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const posY = 80
const sourcekey = ["so", "am", "fm", "fat", "pwm", "pulse"]
const sourcekeyHeader = ["SimpleOsc", "AMOsc", "FMOsc", "FatOsc", "PWMOsc", "PulseOsc"]
const wavekey = ["sine", "square", "sawtooth", "tringle"]
const curveType = [ "linear",
                    "exponential",
                    "sine",
                    "cosine",
                    "bounce",
                    "ripple",
                    "step"]

                    const modulationTypes = ["sine", "square", "sawtooth", "triangle"]

const AMSynth: React.FC<AMSynthType> = ({name, node, lines}) => {
  const [lineData, setLinedata] = useState<Lines[]>([])
  const [muteNode, setMuteNode] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [gainValue, setGainValue] = useState<number>(.5)
  const [k, setK] = useState<string | null>(null)
  const [carrierType, setCarrierType] = useState<string | null>("so")
  const [modulationType, setModulationType] = useState<string | null>("so")
  const [initialX, setInitialX] = useState<number>(0)
  const [frequencyValue, setFrequencyValue] = useState<number>(263.61)
  const [detuneValue, setDetuneValue] = useState<number>(0)
  const [harmonicityValue, setHarmonicityValue] = useState<number>(1)
  const [modulationIndexValue, setModulationIndexValue] = useState<number>(1)
  const [spreadValue, setSpreadValue] = useState<number>(40)
  const [modulationFrequencyValue, setModulationFrequencyValue] = useState<number>(263.61 * 2)
  const [pulseWidthValue, setPulseWidthValue] = useState<number>(.5)
  const [carrModulationType, setCarrModulationType] = useState<string>("sine")

  const [modFrequencyValue, setModFrequencyValue] = useState<number>(263.61 * 2)
  const [modDetuneValue, setModDetuneValue] = useState<number>(0)
  const [modHarmonicityValue, setModHarmonicityValue] = useState<number>(1)
  const [modModulationIndexValue, setModModulationIndexValue] = useState<number>(1)
  const [modSpreadValue, setModSpreadValue] = useState<number>(40)
  const [modModulationFrequencyValue, setModModulationFrequencyValue] = useState<number>(0)
  const [modPulseWidthValue, setModPulseWidthValue] = useState<number>(.5)
  const [modModulationType, setModModulationType] = useState<string>("sine")

  const [envelope, setEnvelope] = useState<{attack: number, decay: number, sustain: number, release: number}>({})
  




  useEffect(() => {
    
    let maxLength

    if ( Object.keys(node.params["oscillator"][carrierType]).length >  Object.keys(node.params["modulation"][modulationType]).length) {
      maxLength = Object.keys(node.params["oscillator"][carrierType]).length
    } else {
      maxLength = Object.keys(node.params["modulation"][modulationType]).length
    }

    console.log(Object.keys(node.params["oscillator"][carrierType]))
    setNodeHeight(175 + maxLength * 32)

    
  }, [carrierType, modulationType])


  const handleMouseDown = (event: MouseEvent, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  const handleMouseMove = (event: MouseEvent) => {
    console.log(k)
    if (isDragging) {
      const difference = event.clientX - initialX!
      if (k?.includes("carrier")) {
        if (k?.includes("frequency")) {
          setFrequencyValue(clamp(Math.floor(frequencyValue + difference), 10, 12000))
        }
        if (k?.includes("detune")) {
          setDetuneValue(clamp(Math.floor(detuneValue + difference), -1200, 1200))
        }
        if (k?.includes("harmonicity")) {
          setHarmonicityValue(clamp(harmonicityValue + difference/100, .01, 10))
        }
        if (k?.includes("modulationType")) {
          setCarrModulationType(modulationTypes[Math.floor(Math.abs(difference) / 50) % 4])
        }
  
        if (k?.includes("modulationIndex")) {
          setModulationIndexValue(clamp(modulationIndexValue + difference*.1, .1, 4000))
        }
        if (k?.includes("spread")) {
          setSpreadValue(clamp(Math.floor(spreadValue + difference), 1, 1199))
        }
        if (k?.includes("modulationFrequency")) {
          setModulationFrequencyValue(clamp(modulationFrequencyValue + difference*.001, .1, 5))
        }
        if (k?.includes("width")) {
          setPulseWidthValue(clamp(pulseWidthValue + difference*.01, .1, 1))
        }
      }
      else {
        if (k?.includes("frequency")) {
          setModFrequencyValue(clamp(Math.floor(modFrequencyValue + difference), 10, 12000))
        }
        if (k?.includes("detune")) {
          setModDetuneValue(clamp(Math.floor(modDetuneValue + difference), -1200, 1200))
        }
        if (k?.includes("harmonicity")) {
          setModHarmonicityValue(clamp(modHarmonicityValue + difference/100, .01, 10))
        }
        if (k?.includes("modulationType")) {
          setModModulationType(modulationTypes[Math.floor(Math.abs(difference) / 50) % 4])
        }
  
        if (k?.includes("modulationIndex")) {
          setModModulationIndexValue(clamp(modModulationIndexValue + difference*.1, .1, 4000))
        }
        if (k?.includes("spread")) {
          setModSpreadValue(clamp(Math.floor(modSpreadValue + difference), 1, 1199))
        }
        if (k?.includes("modulationFrequency")) {
          setModModulationFrequencyValue(clamp(modModulationFrequencyValue + difference*.001, .1, 5))
        }
        if (k?.includes("width")) {
          setModPulseWidthValue(clamp(modPulseWidthValue + difference*.01, .1, 1))
        }
      }
    }
  }


  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(frequencyValue, "frequency", true)
    }
  }, [frequencyValue])


  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(detuneValue, "detune", true)
    }
  }, [detuneValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(harmonicityValue, "harmonicity", true)
    }
  }, [harmonicityValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(carrModulationType, "modulationType", true)
    }
  }, [carrModulationType])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modulationIndexValue, "modulationIndex", true)
    }
  }, [modulationIndexValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(spreadValue, "spread", true)
    }
  }, [spreadValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modulationFrequencyValue, "modulationFrequency", true)
    }
  }, [modulationFrequencyValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(pulseWidthValue, "pulse", true)
    }
  }, [pulseWidthValue])




  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modDetuneValue, "detune", false)
    }
  }, [modDetuneValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modFrequencyValue, "frequency", false)
    }
  }, [modFrequencyValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modHarmonicityValue, "harmonicity", false)
    }
  }, [modHarmonicityValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modModulationType, "modulationType", false)
    }
  }, [modModulationType])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modModulationIndexValue, "modulationIndex", false)
    }
  }, [modModulationIndexValue]) 
  

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modSpreadValue, "spread", false)
    }
  }, [modSpreadValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modModulationFrequencyValue, "modulationFrequency", false)
    }
  }, [modModulationFrequencyValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(modPulseWidthValue, "pulse", false)
    }
  }, [modPulseWidthValue])


  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(gainValue, "gain")
    }
  }, [gainValue])

  const handleNodeValueChange = (value: number | string, type: string, osc: boolean) => {

    switch (type) {
      case "detune":
        if (osc) {
          console.log("oscillator detune value change")
          node.Tone.toneObject.oscillator.detune.value = value;
        } else {
          console.log("modulation detune value change")
          node.Tone.toneObject.modulation.detune.value = value;
        }
        break
      case "frequency":
        if (osc) {
          node.Tone.toneObject.oscillator.frequency.value = value;
        } else {
          node.Tone.toneObject.modulation.frequency.value = value;
        }
        break
    }
  };


  const handleTrigger = () =>{
    node.Tone.toneObject.triggerAttackRelease(frequencyValue, "4n")
  }


  const handleEnvelopeChange = (value: number, type: string) => {

  }

  const handleChange = (event: MouseEvent) => {
    if (event.target.id.split(" ")[1] === "carrier") {
      setCarrierType(event.target.value)
    } else {
      setModulationType(event.target.value)
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
        className="AMSynth-node-body"
        style={{height: `${nodeHeight}px`,
                width: `${Object.keys(node.params).length * 35 + 80}px`
              }}
        key={"AMSynth"+node.id}
        id={node.id} > <div 
              className='header'
              key={"header"+node.id}
      > {name} </div>

        <div
            className='seperator'
            key={"seperator"+node.id}
            style={{width: "1px", 
                    height: "calc(100% - 20px)",
                    position: "absolute",
                    left: "calc(50%)",
                    top: "20px",
                    backgroundColor: "#fabd4242"
                  }}
        > </div>

        <div
            key={"output"+node.id}
            className='output'
            id={"output:"+node.id.split(":")[1]}
            style={{position: "absolute", right: "0px", bottom: "0px"}}
            title={node.id}
        >  </div>

        <div
            key={"trigger"+node.id}
            className='trigger'
            id={"trigger:"+node.id.split(":")[1]}
            style={{position: "absolute", left: "0px", bottom: "0px"}}
            onClick={handleTrigger}
            title={node.id}
        >  </div>

        <div 
            className='carrier-part'
            style={{position: "absolute",
                    left: "0%", top: "0",
                    fontSize: "8pt", color: "#777", width: "50%"
                  }}
        > 
          <div 
              className='header-part'
              style={{position: 'absolute', 
                      top: "23px", left:"50%", 
                      transform: "translateX(-50%)"
                     }}

          >{"carrier"} </div>
          <div 
              className='form-container'
              style={{position: "absolute", 
                      top: "45px", left: "2px", 
                      
                      height:"100%", width: "100%"
                    }}
          >
            <Forms 
                id={node.id} 
                handleSourceChange={handleChange} 
                content={sourcekey}
                headers={sourcekeyHeader}
                type={"source carrier"}
                position={{top: 0, left: 0}}
            />
            <Forms 
                id={node.id} 
                handleSourceChange={handleChange} 
                content={wavekey}
                headers={wavekey}
                type={"wave modulation"}
                position={{top: 0, left: 70}}
            />
            </div>
            <Envelope 
                type='carrier'
                updateEnvelope = {(value, type) => handleEnvelopeChange(value, type)}
                />
            <div 
                className='oscillator-inputs'
                style={{position: "absolute", 
                        left: 0, top: "150px", 
                        width: "calc(100% - 6px)", height: "80px",
                        // border: "1px solid #ff5252"
                      }}
            >
              {Object.keys(node.params["oscillator"][carrierType]).map((key, index) => (
                <React.Fragment key={key}>

                  <div
                      className='input'
                      style={{ position: "absolute", left: "0px", top: `${16 + 32 * index}px`,
                              borderRadius: "50%"
                            }}
                      id={key+":"+node.id.split(":")[1]}
                      title={node.id}
                  ></div>

                <div 
                    key={key}
                    style={{position: "absolute", 
                            left: `${10}px`, top: `${32 * index}px`,
                            // transform: "rotate(-90deg) translateX(50%)",
                            fontSize: "7pt",
                            fontWeight: "500"
                    
                          }}
                  > {key} </div>
                <div
                    className={"slider"}
                    onMouseDown={(event) => handleMouseDown(event, key+"carrier")}
                    style={{
                      position: "absolute",
                      top: `${15 + 32 * index}px`,
                      left: "15px",
                    }}
                    key={`slider-${key}-${index}-carrier`}

                > <div className='inner-text' key={`inner-text-${key}-${index}-carrier`}>
                    { key === "frequency" && name !== "LFO" ? frequencyValue.toFixed(3) :
                      key === "detune" ? detuneValue :
                      key === "harmonicity" ? harmonicityValue.toFixed(3) :
                      key === "modulationIndex" ? modulationIndexValue.toFixed(2) :
                      key === "spread" ? spreadValue :
                      key === "modulationFrequency" ? modulationFrequencyValue.toFixed(3) :
                      key === "width" ? pulseWidthValue.toFixed(3) :
                      carrModulationType
                    } 
                  </div>
                </div>
            </React.Fragment>
              ))}
            

        </div>
      </div>
      <div 
          className='modulation-part'
          style={{position: "absolute",
                  left: "50%", top: "0",
                  // transform: "translateX(-50%)",
                  fontSize: "8pt", color: "#777", width: "50%"
                }}
      > 
        <div 
            className='header-part'
            style={{position: 'absolute', 
                    top: "23px", left:"50%", 
                    transform: "translateX(-50%)"
                    }}

        >{"modulation"} </div>
        <div 
            className='form-container'
            style={{position: "absolute", 
                    top: "45px", left: "5px", 
                    
                    height:"100%", width: "100%"
                  }}
        >
            <Forms 
                id={node.id} 
                handleSourceChange={handleChange} 
                content={sourcekey}
                headers={sourcekeyHeader}
                type={"source moldulation"}
                position={{top: 0, left: 0}}
                />
                
            <Forms 
                id={node.id} 
                handleSourceChange={handleChange} 
                content={wavekey}
                headers={wavekey}
                type={"wave modulation"}
                position={{top: 0, left: 70}}
                />
            
            </div>
            <Envelope 
                type={"modulation"}
                updateEnvelope = {(value, type) => handleEnvelopeChange(value, type)}
                />
            <div 
                className='oscillator-inputs'
                style={{position: "absolute", 
                        left: 0, top: "150px", 
                        width: "calc(100% - 0px)", height: "80px",
                        // border: "1px solid #ff5252"
                      }}
            >
              {Object.keys(node.params["modulation"][modulationType]).map((key, index) => (
                <React.Fragment key={key}>
                  <div
                      className='input'
                      style={{ position: "absolute", right: "0px", top: `${16 + 32 * index}px`,
                              borderRadius: "50%"
                            }}
                      id={key+":"+node.id.split(":")[1]}
                      title={node.id}
                  ></div>

                  <div 
                      key={key}
                      style={{position: "absolute", 
                              left: `${10}px`, top: `${32 * index}px`,
                              // transform: "rotate(-90deg) translateX(50%)",
                              fontSize: "7pt",
                              fontWeight: "500"
                      
                            }}
                    > {key} </div>
                  <div
                      className={"slider"}
                      onMouseDown={(event) => handleMouseDown(event, key)}
                      style={{
                        position: "absolute",
                        top: `${15 + 32 * index}px`,
                        left: "15px",
                      }}
                      key={`slider-${key}-${index}`}

                  > <div className='inner-text' key={`inner-text-${key}-${index}-modulation`}>
                      { key === "frequency" && name !== "LFO" ? modFrequencyValue.toFixed(3) :
                        key === "detune" ? modDetuneValue :
                        key === "harmonicity" ? modHarmonicityValue.toFixed(3) :
                        key === "modulationIndex" ? modModulationIndexValue.toFixed(2) :
                        key === "spread" ? modSpreadValue :
                        key === "modulationFrequency" ? modModulationFrequencyValue.toFixed(3) :
                        key === "width" ? modPulseWidthValue.toFixed(3) :
                        modModulationType
                      } 
                    </div>
                  </div>
              </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default AMSynth
