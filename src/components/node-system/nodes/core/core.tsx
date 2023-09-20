import React, { useEffect, useState } from 'react'
import "./core.scss"

interface CoreType {
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

const Core: React.FC<CoreType> = ({name, node}) => {
  const [muteNode, setMuteNode] = useState<boolean>(false)
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [gainValue, setGainValue] = useState<number>(.5)
  const [k, setK] = useState<string | null>(null)
  const [initialX, setInitialX] = useState<number>(0)


  useEffect(() => {
    if(node.params && node.params.length > 0) {
      setNodeHeight(Object.keys(node.params).length * 40 + 40)
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
    if (isDragging) {
      const difference = event.clientX - initialX!
      if (k.includes("gain")) {
        setGainValue(clamp(gainValue + difference*.001, 0, 1))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      handleNodeValueChange(gainValue, "gain")
    }
  }, [gainValue])

  const handleNodeValueChange = (value: number | string, type: string) => {

    switch (type) {
      case "gain":
        node.Tone.toneObject.gain.value = value;
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
      className="core-node-body"
      style={{height: `${nodeHeight}px`}}
      key={"core"+node.id}
      id={node.id}
      >
      <div 
        className='header'
        key={"header"+node.id}
      > {name} </div>

      <div 
          key={"startStop"+node.id}
          className='start-stop'
          onClick={() => setMuteNode(!muteNode)}
          style={{backgroundColor: `${muteNode ? "#42ff42" : "#aa4242"}`}}
          >
        </div>
               
        {node.name !== "Destination" ? (
          <>
          <div
              key={node.name !== "Clock" ? "output" + node.id : "output" + node.id + " trigger"}
              className='output'
              style={{position: "absolute", right: "0px", bottom: "0px"}}
              id={"output:"+node.id.split(":")[1]}
              title={node.id}
            >  </div>
            {node.name !== "Clock" ? (
                <div
                  className='input'
                  style={{ position: "absolute", left: "0px", bottom: "0px" }}
                  id={"input"+":"+node.id.split(":")[1]}
                  title={node.id}
                ></div> 
            ): null }
          {Object.keys(node.params).map((key, index) => (
            <React.Fragment key={`input-${key}-${index}`}>
              <div
                className='input'
                style={{ position: "absolute", 
                         left: "0px", top: `${45 + 40 * index}px`,
                         borderRadius: "50%"
                        }}
                id={key+":"+node.id.split(":")[1]}
                title={node.id}> </div>
              <div 
                  className='label' 
                  key={`inner-text-${key}-${index}`}
                  style={{position: "absolute", left: "15px", top: `${30 + 40 * index}px`}}
                > {key} </div>

                <div
                    className={"slider"}
                    onMouseDown={(event) => handleMouseDown(event, key)}
                    style={{
                      position: "absolute",
                      top: `${44 + 40 * index}px`,
                      left: "15px",
                    }}
                    key={`slider-${key}-${index}`}
                    >
                <div 
                    className='inner-text' 
                    key={`inner-text-${key}-${index}`}
                    > {gainValue.toFixed(3)} </div>
              </div>
            </React.Fragment>
          ))}
          </>
        ) : (
          <div
            className='input'
            style={{ position: "absolute", left: "0px", top: `40px` }}
            id={"input"+":"+node.id.split(":")[1]}
            title={node.id}
           ></div>
        ) }

    </div>
  </>
  )
}

export default Core
