import React from 'react'

function BtnMenu(prop) {
  return (
    <button
      onClick={prop.handler}

      className='w-[100%] rounded-lg py-2 px-2
                      flex items-center gap-2
                      text-left text-neutral-400
                       hover:bg-[#DB2B39]  hover:text-white
                      '>
      {prop.icon} <p>{prop.text}</p>
    </button>
  )
}

export default BtnMenu