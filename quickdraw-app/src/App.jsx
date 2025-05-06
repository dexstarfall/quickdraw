import React, { useEffect, useRef } from 'react'
import Canvas from './components/Canvas'
import './App.css'
import UiLayer from './components/UiLayer'

// stores
import { useCanvasStore } from '@stores/canvas';
import TextField from './components/TextField';

function App() {
  const staticCanvasRef = useRef(null);
  const interactiveCanvasRef = useRef(null);
  const { action, elements, tool } = useCanvasStore();
  return (
    <>
      <UiLayer
        canvasRef={staticCanvasRef}
      />
      <Canvas
        staticCanvasRef={staticCanvasRef}
        interactiveCanvasRef={interactiveCanvasRef}
      />

      {action === "writing" && (
        <TextField staticCanvasRef={staticCanvasRef} />
      )}
      {elements.length == 0 && tool == "selection" &&
        <div className='  text-neutral-400 pointer-events-none
        z-[10] absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]
        text-center '>
          <p className='custom-font-1 text-6xl text-[#f74856] text-shadow-md text-shadow-[#ca3535de] my-[2rem]'>  QuickDraw</p>
          <p className='text-3xl'>  Pick a Tool </p>
          <p className='text-xl'>and Start Drawing</p>
        </div>
      }

    </>
  )
}

export default App