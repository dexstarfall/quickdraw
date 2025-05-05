import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';

// helpers from packages
import { getFreeDrawDimension } from '@utils/global'
// components
import StaticCanvas from './Canvases/StaticCanvas';
import InteractiveCanvas from './canvases/interactiveCanvas';
import ToolBar from './ToolBar';
import BottomBar from './BottomBar';
import TextField from './TextField';

// Logic for
// Creation of Rough/freehand element 
let generator = rough.generator();

const createElement = (id, type, x1, y1, x2, y2) => {
  const roughProperties = {
    strokeWidth: 3,
    stroke: 'lightcoral',
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };
  let roughElement;
  const height = y2 - y1;
  const width = x2 - x1;

  if (type === "line") {

    roughElement = generator.line(x1, y1, x2, y2, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "rectangle") {

    roughElement = generator.rectangle(x1, y1, width, height, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "ellipse") {

    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "freedraw") {

    return { id, type, points: [{ x: x1, y: y1 }] };

  } else if (type === "text") {

    return { id, type, x1, y1, x2, y2, width, height, text: "" };

  }
  else {
    throw new Error(`Type not found: ${type}`)
  }
}

// for now successfully intregated to store

// undo and redo feature and all elements linked
// const useHistory = (initialState) => {
//   const [index, setIndex] = useState(0);
//   const [history, setHistory] = useState([initialState]); // [[], [{}], [{},{}]]

//   const setState = (action, overwrite = false) => {
//     // in this case always function is passed but fallback if element is passed
//     const newState = typeof action === "function" ? action(history[index]) : action;

//     if (overwrite) {
//       setHistory(pre => pre.map((elm, i) => i === index ? newState : elm));
//     } else {
//       // const undatedState = [...history].slice(0, index -1 );
//       setHistory(pre => [...pre.slice(0, index + 1), newState]);
//       setIndex(pre => pre + 1);
//     }
//   }
//   const undo = () => index > 0 && setIndex(pre => pre - 1);
//   const redo = () => index < history.length - 1 && setIndex(pre => pre + 1);
//   return [history[index], setState, undo, redo];
// }

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

function Canvas() {
  const { action, scale, setScale, setPanOffset, setScaleOffset } = useCanvasStore();

  const elements = useHistoryStore((s) => s.getCurrentState());
  const setElements = useHistoryStore((s) => s.setState);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  const staticCanvasRef = useRef(null);
  const interactiveCanvasRef = useRef(null);
  const pressedKeys = usePressedKeys();

  //current Canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  //  all elements in canvas 
  // const [elements, setElements, undo, redo] = useHistory([]);

  // const [selectionElement, setSelectionElement] = useState(null);

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

  // zoom + pan functionality
  useEffect(() => {
    const mouseWheelHandler = event => {
      const isZoomShortcut = event.ctrlKey || event.altKey || event.metaKey;
      if (isZoomShortcut) {
        event.preventDefault();
        handleZoom(event.deltaY * -0.004)
      } else {
        if (event.shiftKey) {
          setPanOffset(pre => ({ x: pre.x - event.deltaY, y: pre.y }))
        } else {
          setPanOffset(pre => ({ x: pre.x, y: pre.y - event.deltaY }))
        }
      }
    };
    window.addEventListener("wheel", mouseWheelHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", mouseWheelHandler);
    };
  }, []);

  // update Shape
  const updateElement = (id, type, x1, y1, x2, y2, options) => {
    let updatedElement;
    if (["line", "rectangle", "ellipse"].includes(type)) {
      updatedElement = createElement(id, type, x1, y1, x2, y2);
    } else if (type == "freedraw") {
      updatedElement = elements[id];
      const { points } = updatedElement;
      const { width, height } = getFreeDrawDimension(points);
      updatedElement = { ...updatedElement, width, height }
      updatedElement.points = [...points, { x: x2, y: y2 }];
    } else if (type == "text") {
      updatedElement = createElement(id, type, x1, y1, x2, y2);
      updatedElement.text = options.text;
    }
    setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);
  }
  const handleZoom = (delta, reset = false) => {
    if (reset) {
      setScale(1)
      setScaleOffset({ x: 0, y: 0 });
      return;
    }
    const currScale = Math.min(Math.max(scale + delta, 0.1), 10);
    setScale(currScale)
    const canvasRef = staticCanvasRef.current;
    const scaleOffsetX = (canvasRef.width / 2) * (currScale - 1);
    const scaleOffsetY = (canvasRef.height / 2) * (currScale - 1);
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

  }
  return (
    <>
      <ToolBar />

      <BottomBar
        handleZoom={handleZoom}
      />

      {action == "writing" &&
        < TextField
          staticCanvasRef={staticCanvasRef}
          updateElement={updateElement}
        />}

      <InteractiveCanvas
        interactiveCanvasRef={interactiveCanvasRef}
        canvasSize={canvasSize}
        createElement={createElement}
        updateElement={updateElement}
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