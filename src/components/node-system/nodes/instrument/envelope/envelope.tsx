import React, { useEffect, useRef, useState } from 'react'
import "./envelope.scss"
import { events } from '@react-three/fiber'

interface EnvelopeProps {
  type: string
  updateEnvelope: (value: number, type: string) => void
}


const envelopeViewHeight = 70

const Envelope: React.FC<EnvelopeProps> = ({type, updateEnvelope}) => {

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialX, setInitialX] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(0);
  const [attack, setAttack] = useState<number>(20)
  const [decay, setDecay] = useState<number>(60)
  const [sustain, setSustain] = useState<number>(30)
  const [release, setRelease] = useState<number>(120)
  const [nodeInitialPosition, setNodeInitialPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const [whichKnob, setWhichKnob] = useState<HTMLElement | null>(null);
  const [parentWidth, setParentWidth] = useState<number>(0)



  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    const knobElement = event.currentTarget;
    setWhichKnob(knobElement);

    const clientRect = knobElement.getBoundingClientRect();
    const diffX = event.clientX - clientRect.left;
    const diffY = event.clientY - clientRect.top;

    const parentElement = document.querySelector(`.synth-node-body`);
    if (parentElement) {
      const parentRect = parentElement.getBoundingClientRect();
      setNodeInitialPosition({
        left: parentRect.left,
        top: parentRect.top,
      });
    }

    setInitialX(event.clientX);
    setInitialY(event.clientY);
    setIsDragging(true);
  };

  useEffect(() => {
    const outputElement = document.querySelector('.envelope-container');
    setParentWidth(parseInt(outputElement?.parentElement?.parentElement?.parentElement.style.width, 10))
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      event.preventDefault();
  
      const diffX = event.clientX - initialX;
      const diffY = event.clientY - initialY;
  
      if (whichKnob?.className !== 'sustain') {
        if (whichKnob?.className === 'attack') {
          const newAttack = attack + diffX;
          setAttack(newAttack);
          updateEnvelope(newAttack, "attack")
          whichKnob.style.left = `${newAttack}px`;
        }
        if (whichKnob?.className === 'decay') {
          const newDecay = decay + diffX;
          setDecay(newDecay);
          updateEnvelope(newDecay, "decay")
          whichKnob.style.left = `${newDecay}px`;
        }
        if (whichKnob?.className === 'release') {
          const newRelease = release + diffX;
          setRelease(newRelease);
          updateEnvelope(newRelease, "release")
          whichKnob.style.left = `${newRelease}px`;
        }
      } else {
        const newSustain = sustain + diffY;
        setSustain(newSustain);
        updateEnvelope(newSustain, "sustain")
        whichKnob.style.top = `${newSustain}px`;
      }
    }
  };

  
  const handleMouseUp = () => {
    setIsDragging(false);
  
    // Remove event listeners here
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } 
  }, [isDragging]);

  return (
    <div 
        className={`envelope-container ${type}`}
        style={{position: "absolute", top: "30px", left: "0px",
                width: "98.5%", height: `${envelopeViewHeight}px`
              }}
    > 
      <svg
        viewBox={`0 0 ${parentWidth} ${envelopeViewHeight}`}
        width={parentWidth}
        height={envelopeViewHeight}
      >
          <polyline points={`0 ${envelopeViewHeight} ${attack} 0 ${decay} ${sustain} ${release} ${sustain} ${parentWidth} ${envelopeViewHeight}`}
                    stroke="#fabd42" strokeWidth="1"
                    strokeLinecap="round" fill="none" 
                    strokeLinejoin="round"/>

      </svg>
      <div 
          className='adsr'

      >
        <div 
            className='attack'
            onMouseDown={handleMouseDown}
            
            style={{
              position: "absolute", left: `${attack}px`, top: `${0}px`,
              transform: "translate(-50%, -50%)"
            }}

        ></div>
        <div 
            className='decay'
            onMouseDown={handleMouseDown}
            
            style={{
              position: "absolute", left: `${decay}px`, top: `${sustain}px`,
              transform: "translate(-50%, -50%)"
            }}
        ></div>
        <div 
            className='sustain'
            onMouseDown={handleMouseDown}
            
            style={{
              position: "absolute", left: `${decay + Math.floor((release - decay) / 2)}px`, top: `${sustain}px`,
              transform: "translate(-50%, -50%)"
            }}
        ></div>
        <div 
            className='release'
            onMouseDown={handleMouseDown}
            
            style={{
              position: "absolute", left: `${parentWidth}px`, top: `${envelopeViewHeight}px`, 
              transform: "translate(-50%, -50%)"
            }}
        ></div>
      </div>
    </div>
  )
}

export default Envelope
