import React, {useState } from 'react';

import "./node-canvas.scss"
import SearchMenu from './helper/search-menu';
import Node from './node/node';
import {addNode, 
        Nodes, 
        deleteNode, 
        Lines, 
        addLine,
        deleteLine, 
        updateNodePosition, 
        updateLinePositions,
        
        
        } from "./helper/nodeData"

import Canvas from './canvas/canvas';



const NodeCanvasComponent = () => {
  const [nodesData, setNodesData] = useState<Nodes[]>([]);
  const [lineData, setLineData] = useState<Lines[]>([])
  const [menu, setMenu] = useState<boolean>(false)

  const [searchBoxPosition, setSearchBoxPosition] = useState<{x: number, y: number}>({} as any)
  



  const handleAddNode = (name: string, type: string | null) => {
    // setType(type)

    if (name && type) {
      const updatedNodesData = addNode(name, 
                                       searchBoxPosition.x, searchBoxPosition.y,
                                       type,
                                       [],
                                       [], 
                                       null,
                                       [],
                                       nodesData, 0); 
      setNodesData(updatedNodesData); 
      console.log(updatedNodesData)
    }
    setMenu(false);
  }

  const handleLeftClick = () => {
    setMenu(false)
  }

  const handleRightClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setMenu(true)
    setSearchBoxPosition({x: event.clientX, y: event.clientY})
  };


  const handleNodeDelete = (idToDelete: string) => {
    console.log(idToDelete)
    if (idToDelete.includes("Clock")){
    }
    const [updatedNodes, updatedLines] = deleteNode(idToDelete, nodesData, lineData); // Use the nodesData state to delete the node
    setNodesData(updatedNodes); // Update the component's state with the filtered nodes array
    setLineData(updatedLines)
  };


  const handleUpdateNodePositions = (x: number, y: number, id:string) => {
    const updatedNodePositions = updateNodePosition(id, x, y, nodesData)
    setNodesData(updatedNodePositions)
  }

  const handleUpdateLinePositions = (x: number, y: number, nodeID: string) => {
    const updatedLinePositions = updateLinePositions(nodeID, x, y, lineData)
    setLineData(updatedLinePositions)
  }

  const handleLineDelete = (lineID: string) => {
    const [updatedLines, updatedNodes] = deleteLine(lineID, lineData, nodesData)
    setLineData(updatedLines)
    setNodesData(updatedNodes)
  }

  

  const handleLinePosition = (sx: number, 
                              sy: number, 
                              ex: number, 
                              ey: number, 
                              from: string,
                              fromOutput: string, 
                              to: string,
                              toInput:string) => {

    const updatedLines = addLine(sx, sy, ex, ey, from, fromOutput, to, toInput, lineData)
    console.log(updatedLines)
    setLineData(updatedLines)
  }



  // const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   // const searchFieldString = event.currentTarget.value.toLowerCase();
  //   // const updatedSearch = nodesData.filter((item) => console.log(item))
  //   if (event.key === 'Enter') {
  //     console.log('Enter key pressed!');
  //     setMenu(false);
  //   }
  // };

  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      
      setMenu(false);
    }
  };


  
  return (

        <div 
          className="node-canvas" 
          onContextMenu={handleRightClick}
          onClick={handleLeftClick}
          
          >
          {menu ? (
            <SearchMenu 
              // handleChange={handleSearchChange}
              handleEnterKeyPress={handleEnterKeyPress}
              position={searchBoxPosition}
              getInfo={(name, type) => handleAddNode(name, type)}
            
            /> ) : null}

          {nodesData.map((node) => {
            return (     
                <Node
                  key={node.id}
                  node={node}
                  position={{x: node.x, y: node.y}}
                  onDelete={() => handleNodeDelete(node.id)} // Pass the delete function as a prop
                  nodeData={nodesData}
                  lineData={lineData}
                  linePositions={(updatedSx, updatedSy, updatedEx, updatedEy, from, fromOutput, to, toInput) => handleLinePosition(updatedSx, updatedSy, updatedEx, updatedEy, from, fromOutput, to, toInput)}
                  nodePositions={(updatedX, updatedY, id) => handleUpdateNodePositions(updatedX, updatedY, id) }
                  updateLinePositions={(x, y, nodeID) => handleUpdateLinePositions(x, y, nodeID)}
                />
                );
              })}

          <Canvas 
            lines={lineData}
            deleteLine={(lineID) => handleLineDelete(lineID)}
            
          />
        </div>

  );
};

export default NodeCanvasComponent;