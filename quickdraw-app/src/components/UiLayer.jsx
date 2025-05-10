import React from 'react'


//components
import ToolBar from './ToolBar'
import ControlBar from './ControlBar';
import SideBar from './SideBar';


function UiLayer(prop) {

  return (
    <div
      className="pointer-events-none m-4
        fixed z-[5] top-0 left-0 right-0 bottom-0 
        ">

      <SideBar canvasRef={prop.canvasRef} />

      <ControlBar canvasRef={prop.canvasRef} />

      <ToolBar />

    </div>
  )
}

export default UiLayer