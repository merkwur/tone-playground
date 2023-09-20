import React from 'react'


interface FormsProps {
  id: string
  type: string
  content: []
  position: {top: number, left: number}
  handleSourceChange: () => void
}

const Forms = ({id, handleSourceChange, content, type, position}) => {



  return (
    <>
      <div 
          className='form-container'
          style={{position: "absolute", top: `${position.top}px`, left: `${position.left}px`}}
      >
        <select 
            className='form'
            name="sourceType" 
            id={type}
            onChange={handleSourceChange} 
            style={{
                outline: "none", 
                border: "none",
                height: "15px",
                width: "100%",
                display: 'flex',
                color: "#777",
                fontSize: "7pt",
                backgroundColor: "#121212"
            }}
        >
            {content.map((item, index) => (
              <option key={item} value={item}>
                  {item}
              </option>
            ))}
        </select>
      </div>
    </>
  )
}

export default Forms
