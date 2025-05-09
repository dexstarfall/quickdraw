import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnColor(prop) {
  const { strokeColor, setStrokeColor } = usePropertiesStore();
  const isEqual = (strokeColor === prop.color);
  return (
    <button onClick={() => setStrokeColor(prop.color)}
      style={{ backgroundColor: `${prop.color}` }}
      className={`${isEqual ? "outline-1 outline-black ring-2 ring-[crimson]" : null}
                  w-6 h-6 
                  rounded-sm
                  `}>
    </button>
  )
}

export default BtnColor