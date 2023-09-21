import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import './node.scss';
import { Nodes, addConnection, Lines } from '../helper/nodeData';
import Source from '../nodes/source/source';
import Core from '../nodes/core/core';
import Effects from '../nodes/effects/effects';
import Signal from '../nodes/signal/signal';
import SignalTone from '../nodes/signal/signalTone';
import Component from '../nodes/component/component';
// import { NodeParams } from '../helper/types';
import Transport from '../nodes/core/clock/transport';
import Synth from '../nodes/synths/synth';



interface NodeProps {
  node: any
  position: { x: number; y: number };
  onDelete: () => void;
  nodeData: Nodes[];
  lineData: Lines[];
  linePositions: (
    sx: number,
    sy: number,
    ex: number,
    ey: number,
    from: string,
    fromOutput: string,
    to: string,
    toInput: string
  ) => void;
  nodePositions: (x: number, y: number, id: string) => void;
  updateLinePositions: (x: number, y: number, nodeID: string) => void;
}

const Node: React.FC<NodeProps> = ({
  node,
  position,
  onDelete,
  nodeData,
  lineData,
  linePositions,
  nodePositions,
  updateLinePositions,
}) => {

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isEdgeDragging, setIsEdgeDragging] = useState(false);
  const [diff, setDiff] = useState({ x: 0, y: 0 });
  const [fromNode, setFromNode] = useState<HTMLDivElement | null>(null);
  const [initialX, setInitialX] = useState<number | null>(null);
  const [initialY, setInitialY] = useState<number | null>(null);
  const [currentID, setCurrentID] = useState<string>(node.id)

  const nodeRefs = useRef({}) as any; // Initialize an empty object to store node refs

  const handleMouseDown = (event: MouseEvent<HTMLDivElement, MouseEvent> | any, nodeId: string) => {
    const dragFromElement = document.elementFromPoint(event.clientX, event.clientY);
    
    setCurrentID(nodeId)
    if (dragFromElement?.className === 'output') {
      setIsEdgeDragging(true);
      setFromNode(dragFromElement as any);
    } else {
      const nodeElement = nodeRefs.current[nodeId]; // Use the node reference from nodeRefs
      
      if (nodeElement) {
        nodeElement.style.zIndex = 999
        const { left, top } = nodeElement.getBoundingClientRect();
        setDiff({ x: event.clientX - left, y: event.clientY - top });
        setIsDragging(true);
      }
    }

    setInitialX(event.clientX);
    setInitialY(event.clientY);
  };


  

  const handleDeleteClick = () => {
    onDelete(); // Call the onDelete prop to trigger node deletion
  };

  const handleMouseMove = (event: MouseEvent | any) => {
    
    if (isDragging && diff.x < (node.params ? Object.keys(node.params).length * 35 + 80 *.8 
                                : node.name === "Transport" ? 280 : 120) && diff.y < 20) {
      const getNodeID = nodeRefs.current[node.id]?.id; // Use the correct ref and ID
      const x = event.clientX - diff.x;
      const y = event.clientY - diff.y;

      nodeRefs.current[node.id]!.style.left = `${x}px`;
      nodeRefs.current[node.id]!.style.top = `${y}px`;

      nodePositions(x, y, getNodeID!);

      const offsetX = event.clientX - (initialX || 0);
      const offsetY = event.clientY - (initialY || 0);

      if (lineData.length > 0) {
        updateLinePositions(offsetX, offsetY, getNodeID!);
      }
    }
  };

  const handleMouseUp = (event: MouseEvent | any) => {
    const dragEndElement = document.elementFromPoint(event.clientX, event.clientY);
    
    if (dragEndElement && dragEndElement.className === 'input' && 'title' in dragEndElement){
      const title = dragEndElement.title as string; // Use type assertion to specify it's a string

      const connectionType = dragEndElement.id.includes("input") ? "node2node" : "node2param" 
      console.log(connectionType)
      console.log('Drag ended over a div element:', dragEndElement?.id);

      if (fromNode && dragEndElement) {
        if (connectionType === "node2param") {
          
          addConnection(
            fromNode?.id!,
            dragEndElement?.id,
            connectionType,
            nodeData
          );
        } else {
          addConnection(
            fromNode?.title,
            title,
            connectionType,
            nodeData
          );
        }

        const getFrom = fromNode.getBoundingClientRect() as any
        const getTo = dragEndElement.getBoundingClientRect() as any

        const updatedSx = parseFloat(getFrom.left + getFrom.width / 2);
        const updatedSy = parseFloat(getFrom.top + getFrom.height / 2);

        const updatedEx = parseFloat(getTo.left + getTo.width / 2);
        const updatedEy = parseFloat(getTo.top + getTo.height / 2);

        const from = fromNode.parentElement?.id!;
        const to = dragEndElement?.parentElement?.id!;

        // Call the callback function to pass the updated values
        linePositions(updatedSx, updatedSy, updatedEx, updatedEy, from, fromNode.id, to, dragEndElement.id);
      }
    }

    if (fromNode?.title.includes("Clock") && dragEndElement?.className === "trigger") {

    }

    nodeRefs.current[currentID].style.zIndex = 1

    setInitialX(null);
    setInitialY(null);
    setIsEdgeDragging(false);
    setIsDragging(false);
    setFromNode(null);

  };




  useEffect(() => {
    if (isDragging || isEdgeDragging) {
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
  }, [isDragging, isEdgeDragging]);

  // useEffect(() => {console.log("time in provider", tick),  setTick(tick)}, [tick]) // works in here
  // const handleTick = () => {
  //   setTick(tick + 1)
  // }

  return (
    <>
      <div
          key={"wrapper"+node.id}
          className='node-wrapper'
          onMouseDown={(event) => handleMouseDown(event, node.id)} 
          ref={(ref) => (nodeRefs.current[node.id] = ref)} 
          style={{position: 'absolute', 
                  left: position.x, top: position.y, 
                  zIndex: "1", 
                 }} 
          id={node.id}
        >
        {/* <ClockContext.Provider value={{time, setTime}}> */}
          {node.type === 'Source' ? (
            <Source name={node.name} node={Object.assign({}, node)} />
          ) : node.type  === 'Core' ? (
            <>
                { node.name === "Transport" ? (
                  <Transport
                      name={node.name} 
                      node={node}
                      nodes={nodeData}
                  />

                ) : (
                  <Core name={node.name} node={node} />
                ) }
              </>
          ) : node.type  === 'Instrument' ? (
            <Synth 
                name={node.name} 
                node={node} 
            />
          ) : node.type === "Effect" ? (
            <Effects
                name={node.name}
                node={node}
            />
          ) : node.type === "Signal" ? (
            <>
              {node.name !== "Signal" ? (
                <Signal 
                    name={node.name}
                    node={node}
                />
              ) : (
                <SignalTone 
                    name={node.name}
                    node={node}
                />
              )}
            </>
          ) : node.type === "Component" ? (
            <Component 
                name={node.name}
                node={node}
            
            />
          ) : (
            <div>Default Component</div>
          )}
        {node.name !== 'destination' ? (
          <div
            key={"close"+node.id}
            onClick={handleDeleteClick}
            style={{
              position: "absolute",
              top: 0,
              right: "5px",
              width: '10px',
              height: '20px',
              fontSize: '10pt',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'none',
              color: '#272727',
            }}
          >
            X
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Node;
