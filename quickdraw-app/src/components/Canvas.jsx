import React, { useRef, useEffect, useState } from 'react';

// components
import StaticCanvas from './canvases/StaticCanvas';
import InteractiveCanvas from './canvases/interactiveCanvas';

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

function Canvas({ staticCanvasRef, interactiveCanvasRef }) {

  const pressedKeys = usePressedKeys();

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
      <InteractiveCanvas
        interactiveCanvasRef={interactiveCanvasRef}
        canvasSize={canvasSize}
        pressedKeys={pressedKeys}
      />

      <StaticCanvas
        staticCanvasRef={staticCanvasRef}
        canvasSize={canvasSize}
      />
    </>
  )
}

export default Canvas