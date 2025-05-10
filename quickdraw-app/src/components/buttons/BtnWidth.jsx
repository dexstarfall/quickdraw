import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnWidth(prop) {
  const { strokeWidth, setStrokeWidth } = usePropertiesStore();
  const isEqual = (strokeWidth === prop.width);
  return (
    <button onClick={() => setStrokeWidth(prop.width)}
      className={`${isEqual ? "outline-1 outline-black ring-2 ring-[crimson]" : null}
                  w-6 h-6 
                  rounded-sm
                  `}>
      <p>{prop.text}</p>
    </button>
  )
}

export default BtnWidth