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
  const { action } = useCanvasStore();

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
    </>
  )
}

export default App