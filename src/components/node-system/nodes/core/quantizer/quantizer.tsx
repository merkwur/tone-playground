import React, { useCallback, useEffect, useState } from 'react'
import "./quantizer.scss"


const convertToSharp = (note: string) : string => {
  const flatToSharp: {} = {
    'Cb': 'B',
    'C': 'C',
    'C#': 'C#',
    'Db': 'C#',
    'D': 'D',
    'D#': 'D#',
    'Eb': 'D#',
    'E': 'E',
    'Fb': 'E',
    'F': 'F',
    'F#': 'F#',
    'Gb': 'F#',
    'G': 'G',
    'G#': 'G#',
    'Ab': 'G#',
    'A': 'A',
    'A#': 'A#',
    'Bb': 'A#',
    'B': 'B',
    'B#': 'C'
  } 
  
  return flatToSharp[note];
} 

interface QuantizerType {
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


const Quantizer = ({node}) => {
  const [active, setActive] = useState<boolean>(false)
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [resultKeys, setResultKeys] = useState<string[]>([])
  


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
    if (activeKeys.length) {
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

  return (
    <div 
        className="quantizer-node-body" 
        id={node.id}
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
  );
  }

export default Quantizer;
