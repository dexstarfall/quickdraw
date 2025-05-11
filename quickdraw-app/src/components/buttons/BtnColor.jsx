import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnStrokeColor(prop) {
  const { strokeColor, fillColor, setStrokeColor, setFillColor } = usePropertiesStore();
  let isEqual;
  let col;
  if (prop.strokeColor) {
    isEqual = (strokeColor === prop.strokeColor);
    col = `${prop.strokeColor}`
  }
  if (prop.fillColor) {
    isEqual = (fillColor === prop.fillColor);
    col = `${prop.fillColor}`
  }

  const colorHandler = () => {
    if (prop.strokeColor) {
      setStrokeColor(prop.strokeColor)
      return;
    }
    if (prop.fillColor) {
      setFillColor(prop.fillColor)
      return;
    }
  }

  return (
    <button onClick={colorHandler}
      style={{ backgroundColor: col }}
      className={`${isEqual ? " ring-[crimson]" : 'ring-0'}
                  w-6 h-6 ring inset-ring-1 inset-ring-black

                  rounded-sm
                  `}>
    </button>
  )
}

export default BtnStrokeColor