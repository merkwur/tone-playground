import React from 'react'


interface FormsProps {
  id: string
  type: string
  content: string[]
  position: {top: number | string, left: number | string}
  handleSourceChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Change to React.ChangeEvent
}

const Forms: React.FC<FormsProps> = ({handleSourceChange, content, type, position}) => {



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
            {content.map((item) => (
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
