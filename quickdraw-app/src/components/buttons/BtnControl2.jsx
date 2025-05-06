import React from 'react'
import './buttons.css'

function BtnControl2(prop) {
  return (
    <button
      className={`btn-hover1
                w-[40px] h-[40px] btn-pointer pointer-events-auto
                flex justify-center items-center
                text-center
      `}
      onClick={prop.action}
    >
      {prop.icon}
    </button>
  )
}

export default BtnControl2