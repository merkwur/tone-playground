import React, { useEffect, useState } from "react";
import Curves from "./curves";
import { Lines } from "../node-system/helper/nodeData";


interface CurveProps {

  lines: Lines[],
  deleteLine: (lineID: string) => void
}

const Canvas: React.FC<CurveProps> = ({ lines, deleteLine }) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });


  useEffect(() => {
    setDims({width: window.innerWidth, height: window.innerHeight})
  }, [])

  const handleLineDelete = (lineID: string) => {
    deleteLine(lineID)
  }


  return (

    <svg 
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      // style={{position: "absolute"}}
      height={dims.height}
      width={dims.width}
    
      >
      {lines && lines.length > 0 ? (
        <React.Fragment >
          {lines.map((line, index) => (
            <React.Fragment
              key={line.id}
              
            >
              <Curves
                id={line.id}
                key={index}
                line={{sx: line.sx, sy: line.sy, ex: line.ex, ey: line.ey, from: line.from, to: line.to}}
                deleteLine = {(lineID) => handleLineDelete(lineID)}
              />
            </React.Fragment>
          ))}
        </React.Fragment>
      ) : null}
    </svg>
  );
};

export default Canvas;