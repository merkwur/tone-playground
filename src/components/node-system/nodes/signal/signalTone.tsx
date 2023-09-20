import React, { useEffect, useRef, useState } from 'react'
import "./signal.scss"
import Forms from '../instrument/form/forms'
import { UnitParams } from '../../helper/types'
// import { posY, posYMultiplier } from '../../helper/nodeHelpers'


interface SignalType {
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
          Tone: {} 
      }
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const exclude = ["Abs", 
                 "Add", 
                 "AudioToGain", 
                 "GainToAudio", 
                 "GreaterThan", 
                 "GreaterThanZero", 
                 "Multiply", 
                 "Negate",
                 "Pow", "Scale",
                 "ScaleExp", "Signal"
                ]

const unitsTypes = ["audioRange", 
                    'bpm',
                    'cents',
                    'decibels',
                    'degrees',
                    'frequency', 
                    'gain',
                    'hertz',
                    'normalRange',
                    'number',
                    'positive',
                    'radians',
                    'samples',
                    'ticks',
                    'time',
                    'transportTime']

const posY = 50 
const posYMultiplier = 35
const tau = 2 * Math.PI

const SignalTone: React.FC<SignalType> = ({name, node}) => {
  const [startNode, setStartNode] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [signalValue, setSignalValue] = useState<number | string>(440)
  const [units, setUnits] = useState<string>("frequency")
  const [k, setK] = useState<string | null>(null)
  const [initialX, setInitialX] = useState<number>(0)
  const firstRender = useRef(false)


  useEffect(() => {
    if(node.params && Object.keys(node.params).length > 0) {
      if (Object.keys(node.params).includes("filter")) {
        setNodeHeight((Object.keys(node.params).length - 1) * posYMultiplier + 70)
      } else {
        setNodeHeight(Object.keys(node.params).length * posYMultiplier + posY)
      }
    } else {
      setNodeHeight(60)
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (!exclude.includes(node.name)){
        if (startNode) {
          node.Tone.toneObject.start()
        } else {
          node.Tone.toneObject.stop()
        }
      }
    }
  }, [startNode])


  const handleMouseDown = (event: MouseEvent, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const difference = event.clientX - initialX!
      if (k.includes("signalValue")) {
        if (units === "audioRange") {
          setSignalValue(clamp(signalValue + difference*.01, -1, 1))
        }
        if (units === "bpm") {
          setSignalValue(clamp(signalValue + difference, 20, 1200))
        }
        if (units === "cents") {
          setSignalValue(clamp(signalValue + difference, 0, 1200))
        }
        if (units === "decibels") {
          setSignalValue(clamp(signalValue + difference, -48, 48))
        }
        if (units === "degrees") {
          setSignalValue(clamp(signalValue + difference, 0, 360))
        }
        if (units === "frequency") {
          setSignalValue(clamp(signalValue + difference*.1, 0, 8192))
        }
        if (units === "gain") {
          setSignalValue(clamp(signalValue + difference*.01, 0, 1))
        }
        if (units === "hertz") {
          setSignalValue(clamp(signalValue + difference*.01, 0, 8192))
        }
        if (units === "normalRange") {
          setSignalValue(clamp(signalValue + difference*.01, 0, 1))
        }
        if (units === "number") {
          setSignalValue(signalValue + difference *.001)
        }
        if (units === "positive") {
          setSignalValue(clamp(signalValue + difference*.01, 0, Infinity))
        }
        if (units === "radians") {
          setSignalValue(clamp(signalValue + difference*.001, 0, tau))
        }
        if (units === "samples") {
          setSignalValue(clamp(signalValue + difference, 0, Infinity))
        }
        if (units === "ticks") {
          setSignalValue(clamp(signalValue + difference, 0, Infinity))
        }
        if (units === "time") {
          setSignalValue(signalValue)
        }
        if (units === "transportTime") {
          setSignalValue(signalValue)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(signalValue, "signalValue")
    }
  }, [signalValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(units, "units")
    }
  }, [units])


  const handleNodeValueChange = (value: number | string, type: string) => {

    switch (type) {
      case "units":
        node.Tone.toneObject.units = value;
        break
      case "signalValue":
        node.Tone.toneObject.value = value;
        break

    }
  };

  const handleChange = (event: MouseEvent) => {
    setUnits(event.target.value)
    
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
      className="signal-node-body"
      style={{height: `${nodeHeight}px`}}
      key={"Signal"+node.id}
      id={node.id}
      >
      <div 
        className='header'
        key={"header"+node.id}
      > {!name.includes("GreaterThan") ? name : 
         !name.includes("Zero") ? "x > y" : 
         "x > 0"
         } </div>

      <div 
          key={"startStop"+node.id}
          className='start-stop'
          onClick={() => setStartNode(!startNode)}
          style={{backgroundColor: `${startNode ? "#42ff42" : "#aa4242"}`}}
      > </div>
               
      <>
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

        {node.params && Object.keys(node.params).map((key, index) => (
          <React.Fragment key={`input-${key}-${index}`}>
            {key !== "units" ? (              
              <div
                className='input'
                style={{ position: "absolute", 
                          left: "0px", top: `${posY + posYMultiplier * index}px`,
                          borderRadius: "50%"
                        }}
                id={key+":"+node.id.split(":")[1]}
                title={node.id}> </div>
              ) : null}
            <div 
                className='label' 
                key={`inner-text-${key}-${index}`}
                style={{position: "absolute", left: "15px", top: `${posY - 15 + posYMultiplier * index}px`}}
              > {key} </div>
              
              {key !== "units" ?(
                <>  
                <div
                    className={"slider"}
                    onMouseDown={(event) => handleMouseDown(event, key)}
                    style={{
                      position: "absolute",
                      top: `${posY -1 + posYMultiplier * index}px`,
                      left: "15px",
                    }}
                    key={`slider-${key}-${index}`}
                    >
                <div 
                    className='inner-text' 
                    key={`inner-text-${key}-${index}`}
                    > {key === "signalValue" ? signalValue.toFixed(3) :
                      null          
                      } </div>
              </div>
                </>
              ) : (
                <Forms      
                  id={node.id} 
                  handleSourceChange={handleChange} 
                  content={unitsTypes}
                  type={"signal units"}
                  position={{top: `${posY -1 + posYMultiplier * index}`, left: 15}}
                 />
              )}

          </React.Fragment>
        ))}
      </>
    </div>
  </>
  )
}

export default SignalTone
