import React from 'react'
import './buttons.css'

function BtnHistory(prop) {
  return (
    <button
      className={`
                  pointer-events-auto
                  w-10 h-10 
                  flex justify-center items-center
                  text-center 
                 hover:bg-[crimson] hover:text-white
                 `}
      onClick={prop.action}
    >
      {prop.icon}
    </button>
  )
}

export default BtnHistory