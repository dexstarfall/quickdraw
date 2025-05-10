import React, { useState } from 'react'
import { sideBarIcon } from './icons'
// components
import PropertiesBar from './PropertiesBar';
import MenuBar from './MenuBar';

function SideBar(prop) {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuBarHandle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <button onClick={menuBarHandle}
        className={`${isMenuOpen ? "bg-[crimson]" : null}
        pointer-events-auto
        w-[40px] h-[40px] 
        flex justify-center items-center
        text-center rounded-xl
        `}>
        {sideBarIcon}
      </button>

      <div className={` ${isMenuOpen ? '' : 'translate-x-[-220px]'} transition-transform duration-300
         text-white w-[200px]  
        absolute z-[10] top-12 left-0 
        flex flex-col gap-2
        `} >

        <MenuBar canvasRef={prop.canvasRef}/>

        <PropertiesBar />

      </div>

    </div>
  )
}

export default SideBar