import React from 'react'

function BtnMenu(prop) {
  return (
    <button
      onClick={prop.handler}

      className='w-[100%] bg-neutral-800 rounded-lg py-1 px-2 pointer-events-auto
                      text-left flex items-center gap-2'>
      {prop.icon} <p>{prop.text}</p>
    </button>
  )
}

export default BtnMenu