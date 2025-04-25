import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';

let generator = rough.generator();

const createElement = (id, type, x1, y1, x2, y2) => {
  const roughProperties = {
    strokeWidth: 3,
    stroke: 'lightcoral',
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };

  let roughElement = {};
  const height = y2 - y1;
  const width = x2 - x1;

  if (type === "line") {
    roughElement = generator.line(x1, y1, x2, y2, roughProperties);
  } else if (type === "rectangle") {
    roughElement = generator.rectangle(x1, y1, width, height, roughProperties);
  } else if (type === "ellipse") {
    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, roughProperties);
  }
  return { id, type, x1, y1, x2, y2, roughElement };
}

// when no shape is selected check for click on line of shape
const positionOnElement = (mx, my, element, threshold = 5) => {
  const { type, x1, y1, x2, y2 } = element;

  if (type == "rectangle") {
    const topLeft = nearPoint(mx, my, x1, y1, "tl");
    const topRight = nearPoint(mx, my, x2, y1, "tr");
    const bottomLeft = nearPoint(mx, my, x1, y2, "bl");
    const bottomRight = nearPoint(mx, my, x2, y2, "br");

    const nearLeft = Math.abs(mx - x1) <= threshold && my >= y1 && my <= y2;
    const nearRight = Math.abs(mx - x2) <= threshold && my >= y1 && my <= y2;
    const nearTop = Math.abs(my - y1) <= threshold && mx >= x1 && mx <= x2;
    const nearBottom = Math.abs(my - y2) <= threshold && mx >= x1 && mx <= x2;

    const onShape = nearLeft || nearRight || nearTop || nearBottom ? "onShape" : null;

    return topLeft || topRight || bottomLeft || bottomRight || onShape;

  } else if (type == "line") {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: mx, y: my };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));

    const start = nearPoint(mx, my, x1, y1, "start");
    const end = nearPoint(mx, my, x2, y2, "end");

    const onShape = Math.abs(offset) < 1 ? "onShape" : null;

    return start || end || onShape;
  }
};
const distance = (a, b) => {
  return (
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  );
}
const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

// when an shape is already selected and not a line
// function isMouseWithinElement(mx, my, element, threshold = 5) {
//   const { type, properties } = element;
//   const { x1, y1, x2, y2 } = properties;
//   if (type == "rectangle") {
//     const minX = Math.min(x1, x2);
//     const minY = Math.min(y1, y2);
//     const maxX = Math.max(x1, x2);
//     const maxY = Math.max(y1, y2);
//     return mx >= minX && mx <= maxX && my >= minY && my <= maxY;
//   }
// }

// ------------------------------------------------------------------------

const adjustCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;

  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);

  if (type === "rectangle") {
    return { x1: minX, y1: minY, x2: maxX, y2: maxY, };
  } else if (type === "line") {
    if ((x1 < x2 && y1 > y2) || (x1 > x2 && y1 < y2)) {
      return { x1: minX, y1: maxY, x2: maxX, y2: minY };
    }
    return { x1: minX, y1: minY, x2: maxX, y2: maxY, };
  }
}

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
      return "nwse-resize"
    case "tr":
    case "bl":
      return "nesw-resize"
    case "start":
    case "end":
      return "pointer"
    default:
      return "move";
  }
}

const resizeCoordinates = (mX, mY, position, coordiantes) => {
  const { x1, y1, x2, y2 } = coordiantes;

  switch (position) {
    case "tl": return { x1: mX, y1: mY, x2, y2 };
    case "tr": return { x1, y1: mY, x2: mX, y2 };
    case "bl": return { x1: mX, y1, x2, y2: mY };
    case "br": return { x1, y1, x2: mX, y2: mY };
    case "start": return { x1: mX, y1: mY, x2, y2 };
    case "end": return { x1, y1, x2: mX, y2: mY };
    default: null; // fallback: will not get here
  }
}

// undo and redo feature
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

function Canvas() {
  const canvasRef = useRef(null);

  //  all shapes drawn in canvas (for now)
  const [elements, setElements, undo, redo] = useHistory([]);

  // none, drawing, moving,
  const [action, setAction] = useState("none");
  // slection, line, rectangle, ellipse
  const [tool, setTool] = useState("line");

  // currently selected element while moving (for now)
  const [selectionElement, setSelectionElement] = useState(null);

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // rerender everytime any achanges occurs
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [canvasSize, elements, action]);

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

  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);


  // functions
  const getElementAtPosition = (x, y) => {
    return elements
      .map(element => ({ ...element, position: positionOnElement(x, y, element) }))
      .find(element => element.position !== null);
  }

  // update Shape
  const updateElement = (id, type, x1, y1, x2, y2) => {
    const updatedElement = createElement(id, type, x1, y1, x2, y2);
    setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);
  }

  // mouse down
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY);

      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;

        setSelectionElement({ ...element, offsetX, offsetY });
        setElements(pre => pre);

        if (element.position === "onShape") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else { // when tool not selection
      const id = elements.length;
      const newElement = createElement(id, tool, clientX, clientY, clientX, clientY);
      setElements(pre => [...pre, newElement]);
      setAction("drawing");
    }
  }

  // mouse move
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY);

      if (element) {
        event.target.style.cursor = cursorForPosition(element.position);
      } else {
        event.target.style.cursor = "default";
      }
    }

    const id = elements.length - 1;
    if (action === "drawing") {
      const { type, x1, y1 } = elements[id];

      updateElement(id, type, x1, y1, clientX, clientY);
    } else if (action === "moving") {
      const { id, type, x1, y1, x2, y2, offsetX, offsetY } = selectionElement;

      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      const newX2 = newX1 + width;
      const newY2 = newY1 + height;

      updateElement(id, type, newX1, newY1, newX2, newY2);

    } else if (action === "resizing") {
      const { id, type, position, ...coordiantes } = selectionElement;
      const { x1, y1, x2, y2 } = resizeCoordinates(clientX, clientY, position, coordiantes);
      updateElement(id, type, x1, y1, x2, y2);
    }
  }

  // mouse up
  const handleMouseUp = () => {
    const index = elements.length - 1;
    const { id, type, x1, y1, x2, y2 } = elements[index];

    if (action === "drawing") {
      const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);

      updateElement(id, type, x1, y1, x2, y2);
    } else if (action === "resizing") {
      const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);

      updateElement(index, type, x1, y1, x2, y2);
    }

    if (x1 === x2 && y1 === y2) {
      undo ();
    }

    setAction("none");
    setSelectionElement(null);
  }

  return (
    <>
      <div className="fixed">
        <input type="radio" name="selection" id="selection"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Select</label>

        <input type="radio" name="line" id="line"
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>

        <input type="radio" name="rectangle" id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>

        <input type="radio" name="ellipse" id="ellipse"
          checked={tool === "ellipse"}
          onChange={() => setTool("ellipse")}
        />
        <label htmlFor="ellipse">ellipse</label>
      </div>
      <div className="fixed bottom-4 left-4">
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={undo}>Undo</button>

        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={redo}>Redo</button>
      </div>
      <canvas ref={canvasRef}
        className="bg-white"
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
        Canvas here</canvas>
    </>
  )
}

export default Canvas