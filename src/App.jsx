import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { useCanvasStore } from '@stores/canvas';
import UiLayer from './components/UiLayer'
import StaticCanvas from './components/canvases/StaticCanvas'
import InteractiveCanvas from './components/canvases/InteractiveCanvas'
import TextField from './components/TextField';

// keep track of keypress
const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = event => {
      setPressedKeys(prevKeys => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = event => {
      setPressedKeys(prevKeys => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return pressedKeys;
};

function App() {
    const { action, elements, tool } = useCanvasStore();
  const pressedKeys = usePressedKeys();
  // Create refs for the canvases
  const staticCanvasRef = useRef(null);
  const interactiveCanvasRef = useRef(null);
  //current Canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  //on window resize update canvas
  useEffect(() => {

    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <UiLayer
        staticCanvasRef={staticCanvasRef} />

      <InteractiveCanvas
        ref={interactiveCanvasRef}
        canvasSize={canvasSize}
        pressedKeys={pressedKeys}
      />
      <StaticCanvas
        ref={staticCanvasRef}
        canvasSize={canvasSize} />
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