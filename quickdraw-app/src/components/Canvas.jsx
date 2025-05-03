import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';

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

// undo and redo feature and all elements linked
const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]); // [[], [{}], [{},{}]]

  const setState = (action, overwrite = false) => {
    // in this case always function is passed but fallback if element is passed
    const newState = typeof action === "function" ? action(history[index]) : action;

    if (overwrite) {
      setHistory(pre => pre.map((elm, i) => i === index ? newState : elm));
    } else {
      // const undatedState = [...history].slice(0, index -1 );
      setHistory(pre => [...pre.slice(0, index + 1), newState]);
      setIndex(pre => pre + 1);
    }
  }
  const undo = () => index > 0 && setIndex(pre => pre - 1);
  const redo = () => index < history.length - 1 && setIndex(pre => pre + 1);
  return [history[index], setState, undo, redo];
}
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
// for now get width height of perfect freehand tool
const getDimension = (points) => {
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  const width = maxX - minX;
  const height = maxY - minY;
  return { width, height }
}

function Canvas() {
  const staticCanvasRef = useRef(null);
  const interactiveCanvasRef = useRef(null);
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();

  //current Canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  //  all elements drawn in canvas 
  const [elements, setElements, undo, redo] = useHistory([]);
  // action -> none, drawing, moving,
  const [action, setAction] = useState("none");
  // slection, line, rectangle, ellipse
  const [tool, setTool] = useState("freedraw");
  //panoffset
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  // currently selected element while moving (for now)
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 })
  const [selectionElement, setSelectionElement] = useState(null);
  //  scale functionality
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

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
  }, [pressedKeys]);

  // textarea focus when load in text
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing" && selectionElement) {
      requestAnimationFrame(() => {
        textArea.focus()
        textArea.value = selectionElement.text || "";
      });
    }

  }, [action, selectionElement])

  // update Shape
  const updateElement = (id, type, x1, y1, x2, y2, options) => {
    let updatedElement;
    if (["line", "rectangle", "ellipse"].includes(type)) {
      updatedElement = createElement(id, type, x1, y1, x2, y2);
    } else if (type == "freedraw") {
      updatedElement = elements[id];
      const { points } = updatedElement;
      const { width, height } = getDimension(points);
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
      <ToolBar
        tool={tool}
        setTool={setTool}
      />

      <BottomBar
        handleZoom={handleZoom}
        undo={undo}
        redo={redo}
        scale={scale}
      />

      {action == "writing" &&
        < TextField
          staticCanvasRef={staticCanvasRef}
          updateElement={updateElement}
          textAreaRef={textAreaRef}
          selectionElement={selectionElement}
          scale={scale}
          scaleOffset={scaleOffset}
          panOffset={panOffset}
          setAction={setAction}
          setSelectionElement={setSelectionElement}
        />}

      <InteractiveCanvas
        interactiveCanvasRef={interactiveCanvasRef}
        canvasSize={canvasSize}
        createElement={createElement}
        updateElement={updateElement}
        scale={scale}
        scaleOffset={scaleOffset}
        panOffset={panOffset}
        startPanPosition={startPanPosition}
        tool={tool}
        pressedKeys={pressedKeys}
        elements={elements}
        selectionElement={selectionElement}
        setElements={setElements}
        action={action}
        setAction={setAction}
        setSelectionElement={setSelectionElement}
        setPanOffset={setPanOffset}
        setStartPanPosition={setStartPanPosition}
      />

      <StaticCanvas
        staticCanvasRef={staticCanvasRef}
        scaleOffset={scaleOffset}
        setScaleOffset={setScaleOffset}
        canvasSize={canvasSize}
        elements={elements}
        selectionElement={selectionElement}
        action={action}
        scale={scale}
        panOffset={panOffset}
      />
    </>
  )
}

export default Canvas