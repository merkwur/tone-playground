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
                 "ScaleExp", "Subtract"
                ]

const posY = 50 
const posYMultiplier = 35


const Signal: React.FC<SignalType> = ({name, node}) => {
  const [startNode, setStartNode] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [addendValue, setAddendValue] = useState<number>(0)
  const [minValue, setMinValue] = useState<number>(0)
  const [maxValue, setMaxValue] = useState<number>(1)
  const [exponentValue, setExponentValue] = useState<number>(1)
  const [value, setValue] = useState<number>(0)
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
      if (k?.includes("addend")) {
        setAddendValue(clamp(addendValue + difference*.001, -3, 3))
      }
      if (k?.includes("value")) {
        setValue(clamp(value + difference*.001, -1, 1))
      }
      if (k?.includes("min")) {
        setMinValue(clamp(minValue + difference, 0, 100))
      }
      if (k?.includes("max")) {
        setMaxValue(clamp(maxValue + difference, minValue, 1000))
      }
      if (k?.includes("exponent")) {
        setExponentValue(clamp(exponentValue + difference * .01, .1, 10))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(addendValue, "addend")
    }
  }, [addendValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(value, "value")
    }
  }, [value])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(minValue, "min")
    }
  }, [minValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(maxValue, "max")
    }
  }, [maxValue])

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(exponentValue, "exponent")
    }
  }, [exponentValue])


  const handleNodeValueChange = (value: number | string, type: string) => {

    switch (type) {
      case "addend":
        node.Tone.toneObject.addend.value = value;
        break
      case "value":
        node.Tone.toneObject.value = value;
        break
      case "min":
        node.Tone.toneObject.min = minValue;
        break
      case "max":
        node.Tone.toneObject.max = maxValue;
        break
      case "exponent":
        node.Tone.toneObject.exponent = exponentValue;
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

      {!exclude.includes(node.name) ? (
        <div 
            key={"startStop"+node.id}
            className='start-stop'
            onClick={() => setStartNode(!startNode)}
            style={{backgroundColor: `${startNode ? "#42ff42" : "#aa4242"}`}}
        > </div>
      ): null}
               
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
            {key !== "value"? (              
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
              
              {key !== "comparator" && key !== "factor" && key !== "subtrahend" ?(
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
                    > {key === "addend" ? addendValue.toFixed(3) :
                       key === "value" ? value.toFixed(3) :
                       key === "min" ? minValue.toFixed(3) :
                       key === "max" ? maxValue.toFixed(3) :
                       key === "exponent" ? exponentValue.toFixed(3) :

                      null          
                      } </div>
              </div>
                </>
              ) : null}

          </React.Fragment>
        ))}
      </>
    </div>
  </>
  )
}

export default Signal
