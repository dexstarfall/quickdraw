import React from 'react'
import BtnColor from './buttons/BtnColor';
import BtnWidth from './buttons/BtnWidth';

function PropertiesBar() {
  return (
    <div className='pointer-events-auto
    bg-[#1d1d1d] text-neutral-400
                         p-2 flex flex-col gap-2
                        rounded-xl'>
      <div>
        <p>Stroke Color: </p>
        <div className='mt-2
                        flex gap-2 justify-center
                        rounded-xl'>
          <BtnColor color={`white`} />
          <BtnColor color={"grey"} />
          <BtnColor color={"gold"} />
          <BtnColor color={"mediumseagreen"} />
          <BtnColor color={"royalblue"} />
          <BtnColor color={"crimson"} />
        </div>
      </div>
      <div>
        <p>Stroke Width: </p>
        <div className='mt-2
                        flex gap-2 
                        rounded-xl'>
          <BtnWidth text={"S"} width={1} />
          <BtnWidth text={"M"} width={2} />
          <BtnWidth text={"L"} width={3} />
          <BtnWidth text={"XL"} width={4} />
        </div>
      </div>

    </div>
  )
}

export default PropertiesBar