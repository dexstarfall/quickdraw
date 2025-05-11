import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnRoughness(prop) {
  const { roughness, setRoughness } = usePropertiesStore();
  const isEqual = (roughness === prop.roughness);
  return (
    <button onClick={() => setRoughness(prop.roughness)}
      className={`${isEqual ? "ring inset-ring-1 inset-ring-black ring-[crimson]" : null}
                  h-6 px-1 
                  rounded-sm
                  `}>
      <p>{prop.text}</p>
    </button>
  )
}

export default BtnRoughness