import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnWidth(prop) {
  const { strokeWidth, setStrokeWidth } = usePropertiesStore();
  const isEqual = (strokeWidth === prop.width);
  return (
    <button onClick={() => setStrokeWidth(prop.width)}
      className={`${isEqual ? "ring inset-ring-1 inset-ring-black ring-[crimson]" : null}
                  w-6 h-6 
                  rounded-sm
                  `}>
      <p>{prop.text}</p>
    </button>
  )
}

export default BtnWidth