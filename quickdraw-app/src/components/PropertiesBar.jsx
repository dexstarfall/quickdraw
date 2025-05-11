import React from 'react'
import BtnColor from './buttons/BtnColor';
import BtnWidth from './buttons/BtnWidth';
import BtnRoughness from './buttons/BtnRoughness';
import { useCanvasStore } from '@stores/canvas';

function PropertiesBar() {
  const { tool } = useCanvasStore();

  return (
    <div className='pointer-events-auto
    bg-[#1d1d1d] text-neutral-400
                         p-2 flex flex-col gap-2
                        rounded-xl'>
      {["rectangle","ellipse"].includes(tool) && <div>
        <p>Fill:</p>
        <div className='mt-2
                        flex gap-2 justify-center
                        rounded-xl'>
          <BtnColor fillColor={"transparent"} />
          <BtnColor fillColor={`dimgrey`} />
          <BtnColor fillColor={"#ECA400"} />
          <BtnColor fillColor={"#0B7A75"} />
          <BtnColor fillColor={"#192A51"} />
          <BtnColor fillColor={"#841C26"} />
        </div>
      </div>}
      <div>
        <p> {tool === "text" ? 'Font Color:' : 'Stroke Color:'} </p>
        <div className='mt-2
                        flex gap-2 justify-center
                        rounded-xl'>
          <BtnColor strokeColor={`#F0F3F5`} />
          <BtnColor strokeColor={"#342E37"} />
          <BtnColor strokeColor={"gold"} />
          <BtnColor strokeColor={"#419D78"} />
          <BtnColor strokeColor={"#228CDB"} />
          <BtnColor strokeColor={"#D91E36"} /> {/*crimson*/}
        </div>
      </div>
      <div>
        <p> {tool === "text" ? 'Font Size:' : 'Stroke Width:'} </p>
        <div className='mt-2
                        flex gap-2 
                        rounded-xl'>
          <BtnWidth text={"S"} width={1} />
          <BtnWidth text={"M"} width={2} />
          <BtnWidth text={"L"} width={3} />
          <BtnWidth text={"XL"} width={4} />
        </div>
      </div>
      {!(tool === "text" || tool === "freedraw") &&
        <div>
          <p>Roughness: </p>
          <div className='mt-2
                        flex gap-2 
                        rounded-xl'>
            <BtnRoughness text={"Light"} roughness={1} />
            <BtnRoughness text={"Medium"} roughness={2} />
            <BtnRoughness text={"Heavy"} roughness={3} />

          </div>
        </div>}

    </div>
  )
}

export default PropertiesBar