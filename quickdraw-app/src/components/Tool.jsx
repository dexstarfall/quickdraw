import React from 'react'

function Tool(prop) {
  return (
    <>
      <div className="bg-green-300 w-[40px] h-[40px] 
                      flex justify-center items-center
                      text-center rounded-lg">
        <p> {prop.name} </p>
      </div>
    </>
  )
}

export default Tool