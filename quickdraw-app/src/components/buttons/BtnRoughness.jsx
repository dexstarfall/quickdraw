import React from 'react'
import {
  usePropertiesStore
} from '@stores/canvas';

function BtnRoughness(prop) {
  const { roughness, setRoughness } = usePropertiesStore();
  const isEqual = (roughness === prop.roughness);
  return (
    <button onClick={() => setRoughness(prop.roughness)}
      className={`${isEqual ? "outline-1 outline-black ring-2 ring-[crimson]" : null}
                  h-6 px-1
                  rounded-sm
                  `}>
      <p>{prop.text}</p>
    </button>
  )
}

export default BtnRoughness