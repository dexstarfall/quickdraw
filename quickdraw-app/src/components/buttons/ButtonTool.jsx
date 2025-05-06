import React from 'react'
import { useCanvasStore } from '@stores/canvas';
import './buttons.css'

function ButtonTool({ name, icon }) {
  const { tool, setTool } = useCanvasStore();
  const isActive = (tool === name);

  return (
    <label >
      <input type="radio" name="tool" value={name} checked={isActive} className="hidden"
        onChange={() => setTool(name)}
      />
      <div className={`btn-pop1 btn-pointer 
                      w-[40px] h-[40px] pointer-events-auto
                      flex justify-center items-center
                      text-center rounded-lg  text-neutral-200 
                      ${isActive ? 'bg-[#DB2B39] shadow-md shadow-[#8d141e]' :
                      'btn-hover1 '} `}      >
        {icon}
      </div>
    </label>
  )
}

export default ButtonTool