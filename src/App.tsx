
import { useEffect, useState } from 'react'
import './App.scss'
import NodeCanvasComponent from './components/node-system/node-canvas'

const App = () => {
  const [dimesions, setDimensions] = useState({x: 0, y: 0})
  useEffect(() => {
    setDimensions({x: window.innerWidth, y: window.innerHeight})
  }, [])
  
  return (
    <div 
      className='App'
      style={{width: dimesions.x, height: dimesions.y}}
      > <NodeCanvasComponent /> </div>
  )
}

export default App
