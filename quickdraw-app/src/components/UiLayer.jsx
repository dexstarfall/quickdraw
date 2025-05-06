import React from 'react'


//components
import ToolBar from './ToolBar'
import ControlBar from './ControlBar';
import MenuBar from './MenuBar';


function UiLayer(prop) {

  return (
    <>
      <div className="pointer-events-none m-4
        fixed top-0 left-0 right-0 bottom-0 z-[5]
        ">
        <MenuBar
          canvasRef={prop.canvasRef}
        />


        <ControlBar canvasRef={prop.canvasRef} />

        <ToolBar />



      </div>

    </>
  )
}

export default UiLayer