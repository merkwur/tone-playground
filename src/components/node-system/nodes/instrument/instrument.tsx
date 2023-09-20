import React, { useEffect, useRef, useState } from 'react'
import "./instrument.scss"
import Forms from './form/forms'
import Envelope from './envelope/envelope'
import { Lines, NodeParam } from '../../helper/nodeData'
import Synth from '../synths/synth'

interface InstrumentType {
  name: string
  node: { id: string,
          name: string,
          x: number,
          y: number,
          type: string,
          connectedTo: [],
          input: {},
          lines: [],
          params: NodeParam,
          Tone: {} 
      }      
}



const Instrument: React.FC<InstrumentType> = ({name, node, lines}) => {


  return (  
    <>
      {
        node.name === "Synth" ? (
          <Synth name={name} node={node} lines={lines}/>
        ) : null
      }
    </>
  )
}

export default Instrument
