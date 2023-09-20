import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { Nodes } from '../../../helper/nodeData';
import { NodeParams } from '../../../helper/types';
import * as Tone from "tone"



interface TransportType {
      name: string
      node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          lines: [],
          params: NodeParams,
          Tone: {} 
      }

      nodes: Nodes[]
}



const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const Transport: React.FC<TransportType> = ({ name, node, nodes }) => {
  
  const [nodeData, setNodesData] = useState<Nodes[]>([])
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [bpmValue, setBpmValue] = useState<number>(120);
  const [k, setK] = useState<string | number | null>(null);
  const [initialX, setInitialX] = useState<number>(0);
  const [nodeHeight, setNodeHeight] = useState<number>(120);
  const [transportStart, setTransportStart] = useState<boolean>(false)
  const [tick, setTick] = useState<number>(0)
  const [selectedKey, setSelectedKey] = useState<string>("C2")

  const [items, setItems] = useState([
    { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 },
    { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }
  ]);
  const [sliders, setSliders] = useState([
    { id: 0, value: 0 }, { id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 },
    { id: 4, value: 0 }, { id: 5, value: 0 }, { id: 6, value: 0 }, { id: 7, value: 0 }
  ]);


  const [active, setActive] = useState<boolean>(false)
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [resultKeys, setResultKeys] = useState<string[]>([])
  
  const selectedKeyRef = useRef<string>("C2");



  const handleKeyClick = (key: string) => {
    
    setActiveKeys((prevActiveKeys) => {
      let updatedKeys;
      if (prevActiveKeys.includes(key)) {
        updatedKeys = prevActiveKeys.filter((activeKey) => activeKey !== key);
      } else {
        updatedKeys = [...prevActiveKeys, key];
      }

  
      // if key is already in activeKeys, remove it without adding the red highlight
      if (prevActiveKeys.includes(key)) {
        return updatedKeys;
      }
          
      return updatedKeys;
    });
  };

  const updateResultKeys = useCallback((keys: []) => {
    setResultKeys(keys)},
    [setResultKeys])
  
  useEffect(() => {
    if (activeKeys.length > 0) {
      updateResultKeys(activeKeys);
    } 
  }, [activeKeys, updateResultKeys]);
  

  
  const renderKey = (key: string, isBlack: boolean) => {
    const isActive = activeKeys.includes(key);
    let className = `key ${isBlack ? 'black' : 'white'} ${key}`;
    if (isActive) {
      className += ' active';
    } 
    return (
      <div
        className={className}
        onClick={() => handleKeyClick(key)}
      >
        <span>{key}</span>
      </div>
    );
  };


  useEffect(() => {
    const space = 4
    const y = 30
    const updatedItems = items.map((item, index) => {
      const x = index * 15 + ((index + 1) * space)
      
      return { ...item, x, y };
    });

    setItems(updatedItems);

    const updatedSliders = sliders.map((item, index) => {

      const x = index * 15 + ((index + 1) * space)
      const y = 27
      return { ...item, x, y };
    });

    setSliders(updatedSliders)
  }, []);


  

  useEffect(() => {
    if (transportStart) {
      scheduleLoopTransport()
    }
  }, [transportStart])


  const scheduleLoopTransport = () => {
    if (transportStart) {
      setTick(0)
      Tone.Transport.scheduleRepeat(() => {
        setTick((prevTick) => prevTick + 1); 
        console.log(sliders[tick % sliders.length].value)
        node.connectedTo.forEach((element) => {
          const matchingNode = nodes.find((n) => n.id === element);
          if (matchingNode) {
            if (matchingNode.name !== "NoiseSynth") {
              matchingNode.Tone.toneObject.triggerAttackRelease(selectedKeyRef.current, 60 / bpmValue);
            } else {
              matchingNode.Tone.toneObject.triggerAttackRelease(60 / bpmValue);
            }
          }
        });

        const envelopes = nodes.filter((n) => {
          return n.name.includes("Envelope");
        });
        
        envelopes.forEach((element) => {
          element.Tone.toneObject.triggerAttackRelease(60 / bpmValue)
        })

  
      }, 60 / bpmValue)
    }
  }

  useEffect(() => {
    const value: number = parseFloat(sliders[tick % sliders.length].value.toFixed(1))
    
    const keyIndex = Math.floor(value * 10)
    
    const octave = (keyIndex % keys.length) < 3 ? (keyIndex % keys.length) + 2 : (keyIndex % keys.length)
    
    const newKey = keys[keyIndex] + octave.toString()
    selectedKeyRef.current = newKey;
    setSelectedKey(newKey)

  }, [tick])

  const handleRunTransport = () => {
    if (!transportStart) {
      setTransportStart(true)
      Tone.Transport.start()
    } else {
      setTransportStart(false)
      Tone.Transport.stop()
    }
  }

  // useEffect(() => {console.log(selectedKey)}, [selectedKey])

  const handleMouseDown = (event: MouseEvent, key: string | number) => {
    setInitialX(event.clientX)
    setIsDragging(true)
    setK(key)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const difference = event.clientX - initialX!
      if (typeof k === "number") {
        handleSequencerSlider(event, k)
      }else if (k?.includes("bpm")) {
        setBpmValue(clamp(bpmValue + difference, 4, 1200))
      }

    }
  }


  const handleSequencerSlider = (event: MouseEvent, key: number) => {
    const difference = event.clientX - initialX!
    const newValue = clamp(sliders[Number(key)].value + difference * 0.001, 0, 1);
    setSliders((prevSliders) => {
      const updatedSliders = [...prevSliders];
      updatedSliders[Number(key
        )].value = newValue;
      return updatedSliders;
    });
    
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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
        className="transport-node-body"
        style={{height: `${nodeHeight+60}px`}}
        key={"Transport"+node.id}
        id={node.id}
      >
      <div 
          className='header'
          key={"header"+node.id}
      > Transport </div>

      <div 
          key={"startStop"+node.id}
          className='start-stop'
          onClick={handleRunTransport}
          style={{backgroundColor: `${transportStart ? "#42ff42" : "#aa4242"}`}}
          >
      </div>

      <div 
          className='output'
          id={"output"+":"+node.id.split(":")[1]}
          style={{position: "absolute", right: 0, bottom: 0 , width: "30px"}}
          title={node.id}
      > </div>



      <div className='transport-content-container'>
        <div 
            className='clock-content'
        >
          <div 
              className='clock-screen'
          > {bpmValue} </div>
          <div className='bpm-slider'>
            <div 
                className='label'               
              > bpm </div>
            <div
                className={"slider"}
                onMouseDown={(event) => handleMouseDown(event, "bpm")}
                key={`slider`}
            > <div 
                  className='inner-text'
              > {bpmValue} </div>
            </div>       
          </div>

          <div className='time-sig-slider'>
            <div 
                className='label'               
              > timeSig </div>
            <div
                className={"slider"}
                onMouseDown={(event) => handleMouseDown(event, "bpm")}
                key={`slider`}
            > <div 
                  className='inner-text'
              > 4/4 </div>
            </div>       
          </div>   
        </div>
        <div className='settings'>
          <div 
              className='sequencer-content'
              style={{width: "100%"}}
          >       
            {items.map((item, index) => (
              <div
              key={item.id}
              className={`item ${item.id === (tick - 1) % items.length ? "blink" : ""}`}
              style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
              />
              ))}
              {sliders.map((item, index) => (
                <div
                  key={item.id}
                  className={`sliders ${item.id}`}
                  onMouseDown={(event) => handleMouseDown(event, index)}
                  style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
                >
                  <div className='inner-text'>
                    {item.value.toFixed(1)} 
                  </div>
                </div>
              ))}
          </div>
          <div 
              className='quantizer-content'
          >
            <div className='piano'>
              <div className='keys'>
                {renderKey('C')}
                {renderKey('C#', true)}
                {renderKey('D')}
                {renderKey('D#', true)}
                {renderKey('E')}
                {renderKey('F')}
                {renderKey('F#', true)}
                {renderKey('G')}
                {renderKey('G#', true)}
                {renderKey('A')}
                {renderKey('A#', true)}
                {renderKey('B')}
              </div>
            </div>
          </div>
        </div>
      </div>  

    </div>
  </>
  )
}

export default Transport
