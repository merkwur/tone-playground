import React, { useEffect, useRef, useState } from 'react'
import "./effects.scss"
import Forms from '../instrument/form/forms'

interface EffectsType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          output: [],
          lines: [],
          params: {},
          ticks: 0,
          Tone: {} 
      }
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const waves = ["sine", "square", "sawtooth", "tringle"]
const posY = 60
const posYMultiplier = 30
const exclude = ["AutoWah", 
                 "BitCrusher", 
                 "Chebyshev", 
                 "Distortion", 
                 "FrequencyShifter", 
                 "PitchShift", 
                 "FeedbackDelay",
                 "Freeverb", "Phaser", "PingPongDelay", "Reverb", "Vibrato"]


const initialStates = {
                        frequency:     {value: 5,     min: 1,      max: 8196, multiplier: .1   },
                        baseFrequency: {value: 263.3, min: 20,     max: 8196, multiplier: .1   },
                        octaves:       {value: 0,     min: -6,     max: 6,    multiplier: .1   },
                        depth:         {value: 1,     min: 0,      max: 1,    multiplier: .001 },
                        wet:           {value: 1,     min: 0,      max: 1,    multiplier: .001 },
                        bits:          {value: 1,     min: 1,      max: 16,   multiplier:  1   },
                        order:         {value: 1,     min: 1,      max: 100,  multiplier:  1   },
                        delayTime:     {value: .25,   min: 0,      max: 1,    multiplier: .001 },
                        distortion:    {value: 0,     min: 0,      max: 1,    multiplier: .001 },
                        pitch:         {value: 0,     min: -1200,  max: 1200, multiplier: .1   },
                        sensitivity:   {value: 0,     min: -48,    max: 48,   multiplier:  1   },
                        Q:             {value: 2,     min: 1,      max: 10,   multiplier: .1   },
                        feedback:      {value: .5,    min: 0,      max: 1,    multiplier: .001 },
                        dampening:     {value: .5,    min: 0,      max: 1,    multiplier: .001 },
                        roomSize:      {value: .5,    min: 0,      max: 1,    multiplier: .001 },
                        decay:         {value: .78,   min: 0,      max: 1,    multiplier: .001 },
}



const Effects: React.FC<EffectsType> = ({name, node}) => {
  const [startNode, setStartNode] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [k, setK] = useState<string | null>(null)
  const [waveType, setWaveType] = useState<string>("sine")
  const [initialX, setInitialX] = useState<number>(0)
  const [state, setState] = useState(initialStates)
  const firstRender = useRef(false)


  

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

  
  useEffect(() => {
    if(node.params && Object.keys(node.params).length > 0) {
      if (Object.keys(node.params).includes("filter")) {
        setNodeHeight((Object.keys(node.params).length - 1) * posYMultiplier + posY)
      } else {
        setNodeHeight(Object.keys(node.params).length * posYMultiplier + posY + 10)
      }
    } else {
      setNodeHeight(80)
    }
  }, [])


  const handleMouseDown = (event: MouseEvent, key: string) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  

  const handleMouseMove = (event: MouseEvent) => {
    
    if (isDragging && k) {
      const difference = event.clientX - initialX!
      const parameter = initialStates[k]
      const clampedValue = clamp(state[k].value + difference * parameter.multiplier, parameter.min, parameter.max);


      
      setState((prevState) => ({
        ...prevState,
        [k]: { ...prevState[k], value: clampedValue },
      }));
      handleNodeValueChange(clampedValue, k);
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleNodeValueChange = (value: number | string, type: string) => {
    
    if (node.Tone.toneObject[type].value) {
      node.Tone.toneObject[type].value = value
    } else {
        node.Tone.toneObject[type] = value
      }
    }


  const handleChange = (event: MouseEvent) => {
    // setWaveType(event.target.value) 
    handleNodeValueChange(event.target.value, "type")
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
      className="effects-node-body"
      style={{height: `${nodeHeight}px`}}
      key={"Effects"+node.id}
      id={node.id}
      >
      <div 
        className='header'
        key={"header"+node.id}
      > {name} </div>

      
      {!exclude.includes(node.name) ? (
        <div 
            key={"startStop"+node.id}
            className='start-stop'
            onClick={() => setStartNode(!startNode)}
            style={{backgroundColor: `${startNode ? "#42ff42" : "#aa4242"}`}}
            >
          </div>
      ) : null }


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

        {!exclude.includes(node.name) ? (
          <Forms 
              id={node.id} 
              handleSourceChange={handleChange} 
              content={waves}
              type={"source oscillator"}
              position={{top: 25, left: 0}}
          />
        ) : null}



      {Object.keys(node.params).map((key, index) => (
        <React.Fragment key={`input-${key}-${index}`}>
        {key !== "filter" ? (
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
                  > {
                     state[key].value.toFixed(3)
                  } </div>
            </div>
          </>

        ) : null}
        </React.Fragment>
      ))}
    </div>
  </>
  )
}

export default Effects
