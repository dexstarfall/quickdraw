import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '../utils/global'
import { distance } from '../utils/global'

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

// Logic for
// positionOnElement - onShape, start, end, tl, tr, bl, br
// -------------------------------------------------------

// check -> 'click' on 'point' 
const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

// check -> 'click' on 'line b/w 2 points'
const onLine = (mx, my, x1, y1, x2, y2, threshold = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x: mx, y: my };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < threshold ? "onShape" : null;
}
// check -> 'click' on 'edge of rectangle'
const onRectangle = (mx, my, x1, y1, x2, y2, threshold = 5) => {
  const nearLeft = Math.abs(mx - x1) <= threshold && my >= y1 && my <= y2;
  const nearRight = Math.abs(mx - x2) <= threshold && my >= y1 && my <= y2;
  const nearTop = Math.abs(my - y1) <= threshold && mx >= x1 && mx <= x2;
  const nearBottom = Math.abs(my - y2) <= threshold && mx >= x1 && mx <= x2;

  return nearLeft || nearRight || nearTop || nearBottom ? "onShape" : null;
}
// when no shape is selected check -> 'click' on 'edge of element'
const positionOnElement = (mx, my, element, threshold = 5) => {
  const { type, x1, y1, x2, y2 } = element;

  if (type === "rectangle") {
    const topLeft = nearPoint(mx, my, x1, y1, "tl");
    const topRight = nearPoint(mx, my, x2, y1, "tr");
    const bottomLeft = nearPoint(mx, my, x1, y2, "bl");
    const bottomRight = nearPoint(mx, my, x2, y2, "br");

    const on = onRectangle(mx, my, x1, y1, x2, y2, threshold);
    return topLeft || topRight || bottomLeft || bottomRight || on;

  } else if (type === "line") {
    const start = nearPoint(mx, my, x1, y1, "start");
    const end = nearPoint(mx, my, x2, y2, "end");

    const on = onLine(mx, my, x1, y1, x2, y2);
    return start || end || on;

  } else if (type === "freedraw") {
    const betweenAnyPoints = element.points.some((point, i) => {
      const nextPoint = element.points[i + 1]; // [{x,y},{x,y}, ....]

      if (!nextPoint) { return false; }
      return onLine(mx, my, point.x, point.y, nextPoint.x, nextPoint.y, 10) != null;
    })
    return betweenAnyPoints ? "onShape" : null;
  } else if (type == "text") {
    return mx >= x1 && mx <= x2 && my >= y1 && my <= y2 ? "onShape" : null;
  }
};

const adjustmentRequired = (type) => ["line", "rectangle", "ellipse", "text"].includes(type);

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
// draw rough element or perfect-freehand
const drawElement = (roughCanvas, canvasCtx, element) => {
  const { type, points } = element;

  if (type === "line" || type === "rectangle" || type === "ellipse") {

    roughCanvas.draw(element.roughElement);

  } else if (type === "freedraw") {

    const stroke = getSvgPathFromStroke(getStroke(points))
    canvasCtx.fill(new Path2D(stroke))

  } else if (type === "text") {

    const { x1, y1, text } = element;
    canvasCtx.font = "1rem consolas";
    canvasCtx.textBaseline = "top";
    // const xNew = x1 - canvasCtx.measureText(text).width / 2;
    canvasCtx.fillText(text, x1, y1);

  }
}
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
  const canvasRef = useRef(null);
  const textAreaRef = useRef();

  //  all shapes drawn in canvas (for now)
  const [elements, setElements, undo, redo] = useHistory([]);

  // none, drawing, moving,
  const [action, setAction] = useState("none");
  // slection, line, rectangle, ellipse
  const [tool, setTool] = useState("text");

  // currently selected element while moving (for now)
  const [selectionElement, setSelectionElement] = useState(null);
  //current Canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // rerender everytime any changes occurs
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(elm => {
      // if (action === "writing" && selectionElement.id === elm.id) return;

      drawElement(roughCanvas, canvasCtx, elm)
    });

  }, [canvasSize, elements, action, selectionElement]);

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

  // undo redo functionality
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

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      requestAnimationFrame(() => textArea.focus());
      textArea.value = selectionElement.text;
    }
  }, [action, selectionElement])

  // return element at position
  const getElementAtPosition = (x, y) => {
    return elements
      .map(element => ({ ...element, position: positionOnElement(x, y, element) }))
      .find(element => element.position !== null);
  }

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

  const moveElement = (element, newPoints) => {
    const { id, type } = element;
    let movedElement;
    if (type === "freedraw") {
      movedElement = { ...element, points: newPoints };
    } else {
      const { x1, y1, x2, y2 } = newPoints
      movedElement = createElement(id, type, x1, y1, x2, y2);
      movedElement.text = element.text;
    }
    setElements((pre => pre.map((elm, i) => i === id ? movedElement : elm)), true);
  }

  // mouse down
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;

    if (action === "writing") {
      const { id, type, x1, y1 } = selectionElement;
      const options = {
        text: textAreaRef.current.value
      }
      const width = canvasRef.current.getContext('2d').measureText(options.text).width;
      const height = 16;
      updateElement(id, type, x1, y1, x1 + width, y1 + height, options);
      setAction("none");
      return;
    }

    const element = getElementAtPosition(clientX, clientY);
    if (tool === "selection") {

      if (element) {
        if (element.type === "freedraw") {
          const xOffsets = element.points.map(point => clientX - point.x);
          const yOffsets = element.points.map(point => clientY - point.y);
          setSelectionElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectionElement({ ...element, offsetX, offsetY });
        }
        setElements(pre => pre);

        if (element.position === "onShape") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else { // when tool not selection

      if (element && element.type == "text") {
        const { x1, y1 } = element;
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectionElement({ ...element, offsetX, offsetY });
        if (clientX - offsetX === x1 && clientY - offsetY === y1) {
          setAction("writing");
          return;
        }
      }

      const id = elements.length;
      const newElement = createElement(id, tool, clientX, clientY, clientX, clientY);
      setElements(pre => [...pre, newElement]);
      setSelectionElement(newElement);

      if (tool == "text") {
        setAction("writing");
      } else {
        setAction("drawing");
      }
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

    if (action === "drawing") {
      const id = elements.length - 1;
      const { type, x1, y1 } = elements[id];

      updateElement(id, type, x1, y1, clientX, clientY);
    } else if (action === "moving") {

      const { id, type } = selectionElement;
      let newPoints;
      if (type === "freedraw") {

        const { points, xOffsets, yOffsets } = selectionElement;
        newPoints = points.map((_, i) => ({
          x: clientX - xOffsets[i],
          y: clientY - yOffsets[i],
        }))

      } else if (["line", "rectangle", "text"].includes(type)) {

        const { offsetX, offsetY, width, height } = selectionElement;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        newPoints = {
          x1: newX1, y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height
        }

      }
      moveElement(elements[id], newPoints);

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

    if (adjustmentRequired(type)) {
      if (action === "drawing") {
        const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);

        updateElement(id, type, x1, y1, x2, y2);
      } else if (action === "resizing") {
        const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);

        updateElement(index, type, x1, y1, x2, y2);
      }
      if (x1 === x2 && y1 === y2) {
        undo();
      }
      // if (selectionElement.value === textAreaRef.current.value) {
      //   undo();
      // }

      if (action === "writing") return;
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

        <input type="radio" name="freedraw" id="freedraw"
          checked={tool === "freedraw"}
          onChange={() => setTool("freedraw")}
        />
        <label htmlFor="freedraw">Pencil</label>

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

        <input type="radio" name="text" id="text"
          checked={tool === "text"}
          onChange={() => setTool("text")}
        />
        <label htmlFor="text">Text</label>

      </div>
      <div className="fixed bottom-4 left-4">
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={undo}>Undo</button>

        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={redo}>Redo</button>
      </div>
      {action == "writing" &&
        <textarea
          ref={textAreaRef}
          className="fixed bg-transparent  font-[consolas] outline-0 resize-none
          wrap-break-word overflow-hidden whitespace-pre"
          style={{ top: selectionElement.y1 - 5, left: selectionElement.x1 }}
        >        </textarea>
      }
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