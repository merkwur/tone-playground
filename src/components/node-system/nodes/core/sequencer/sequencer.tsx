import React, {  useEffect, useState } from 'react'
import "./sequencer.scss"
import { Nodes } from '../../../helper/nodeData'



interface SequencerType {
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
                        nodes: Nodes[]
}


const Sequencer: React.FC<SequencerType> = ({ name, node }) => {
  const [nodeData, setNodeData] = useState<Nodes[]>([])

  const [items, setItems] = useState([
    { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 },
    { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }
  ]);
  const [sliders, setSliders] = useState([
    { id: 0, value: 0 }, { id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 },
    { id: 4, value: 0 }, { id: 5, value: 0 }, { id: 6, value: 0 }, { id: 7, value: 0 }
  ]);



  const [isDragging, setIsDragging] = useState(false);
  const [initialX, setInitialX] = useState<number | null>(null);
  const [k, setK] = useState<string>(""); // Key to track the slider being dragged

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };


  useEffect(() => {
    const radius = 40; // Adjust the radius as needed
    const centerX = 87; // Adjust the center X coordinate
    const centerY = 97; // Adjust the center Y coordinate

    const angleIncrement = (Math.PI * 2) / items.length;

    const updatedItems = items.map((item, index) => {
      const angle = angleIncrement * index;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return { ...item, x, y };
    });

    setItems(updatedItems);

    const radiusInner = 60; // Adjust the radius as needed
    const IcenterX = 79; // Adjust the center X coordinate
    const IcenterY = 89; // Adjust the center Y coordinate

    const updatedSliders = sliders.map((item, index) => {
      const angle = angleIncrement * index;
      const x = IcenterX + radiusInner * Math.cos(angle);
      const y = IcenterY + radiusInner * Math.sin(angle);

      return { ...item, x, y };
    });

    setSliders(updatedSliders)
  }, []);

  const handleMouseDown = (event: MouseEvent, key: number) => {
    setInitialX(event.clientX);
    setIsDragging(true);
    setK(key);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const difference = event.clientX - initialX!;
      
      const newValue = clamp(sliders[Number(k)].value + difference * 0.001, 0, 1);
      // Update the slider value
      setSliders((prevSliders) => {
        const updatedSliders = [...prevSliders];
        updatedSliders[Number(k)].value = newValue;
        return updatedSliders;
        });
      }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    <div className="circle-container">
      <>
      {items.map((item, index) => (
        <div
        key={item.id}
        className={`item ${item.id === 5 % items.length ? "blink" : ""}`}
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
              {item.value.toFixed(2)} 
            </div>
          </div>
        ))}
      </>
    </div>
  );
};

export default Sequencer;
