import React, { useEffect, useState } from 'react';

interface LineProps {
  id: string,
  line: {sx: number, sy: number, ex: number, ey: number, from: string, to:string}
  deleteLine: (lineID: string) => void
}

interface Curve {
  mx: number;
  my: number;
  x1: number;
  y1: number; // Add a comma here
  x2: number;
  y2: number;
  x: number;
  y: number;
}

const Curves: React.FC<LineProps> = ({ id, line, deleteLine }) => {
  const [curvePosition, setCurvePosition] = useState<Curve | null>(null);


  useEffect(() => {
    const dx: number = Math.abs(line.ex - line.sx);
    const controlPointLength = dx / 2
    const x1: number = line.sx + controlPointLength;
    const x2: number = line.ex - controlPointLength;

    setCurvePosition({
      mx: line.sx,
      my: line.sy,
      x1: x1,
      y1: line.sy,
      x2: x2,
      y2: line.ey,
      x: line.ex,
      y: line.ey,
    });
  }, [line]);

  const handleClick = () => {
    deleteLine(id)
    console.log("clicked on path: ", "id ", id)
  }


  if (!curvePosition) {
    return null; 
  }

  return (
    <path
      d={`M ${curvePosition?.mx} ${curvePosition?.my} C ${curvePosition?.x1} ${curvePosition?.y1}, ${curvePosition?.x2} ${curvePosition?.y2}, ${curvePosition?.x} ${curvePosition?.y}`}
      // stroke='#f734d7'
      stroke='#121212'
      strokeWidth={10}
      strokeLinecap='round'
      fill='transparent'
      onClick={handleClick}
    
      
    />
  );
};

export default Curves;
