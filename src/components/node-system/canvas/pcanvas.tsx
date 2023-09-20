import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Lines } from "../node-system/helper/nodeData";

interface PCanvasProps {
  lineData: Lines[];
}

const PCanvas: React.FC<PCanvasProps> = ({ lineData }) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    p5.background(0, 0, 0, 0);
    p5.noLoop();
  };

  const draw = (p5: p5Types) => {
    p5.stroke(0); // Set stroke color here
    p5.strokeWeight(5);

    for (const line of lineData) {
      const { sx, sy, ex, ey } = line.positions;
      p5.line(sx, sy, ex, ey);
    }
  };

  React.useEffect(() => {
    if (lineData.length > 0) {
      const p5Instance = (window as any).__reactP5Instance;

      if (p5Instance) {
        p5Instance.remove();
      }

      new Sketch(draw, setup);
    }
  }, [lineData]);

  return <Sketch setup={setup} draw={draw} />;
};

export default PCanvas;
