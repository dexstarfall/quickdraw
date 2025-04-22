import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';

let generator = rough.generator();

function generateSeed() {
  return Math.floor(Math.random() * (2 ** 31 - 1)) + 1;
}

function createElement(id, properties, type) {
  const prop1 = {
    strokeWidth: 1,
    seed: generateSeed(),
  }
  const prop2 = {
    strokeWidth: 3,
    seed: 3,
  }
  const prop3 = {
    strokeWidth: 5,
    seed: 3,
  }
  // const slop

  const props = {
    ...prop3,
    stroke: 'lightcoral',
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };

  const { x1, y1, x2, y2, width, height } = properties;

  let roughElement = {};

  if (type === "line") {
    roughElement = generator.line(x1, y1, x2, y2, props);
  } else if (type === "rectangle") {
    const rectWidth = x2 - x1;
    const rectHeight = y2 - y1;
    roughElement = generator.rectangle(x1, y1, rectWidth, rectHeight, props);
  } else if (type === "ellipse") {
    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, props);
  }
  return { id, properties, roughElement, type };
}


// --------------------------------------


function Canvas() {
  const canvasRef = useRef(null);

  // none, drawing, moving,
  const [action, setAction] = useState("none");
  // slection, line, rectangle, ellipse
  const [tool, setTool] = useState("line");

  //  all shapes drawn in canvas (for now)
  const [allElements, setAllElements] = useState([]);
  // currently selected element while moving (for now)
  const [selectedElement, setSelectedElement] = useState(null);

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

    allElements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [canvasSize, allElements, action]);

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


  //functions
  function isWithinElement(mx, my, element, threshold = 5) {
    function distance(a, b) {
      return (
        Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
      );
    }
    const { type } = element;
    const { x1, y1, x2, y2 } = element.properties;
    if (type == "rectangle") {
      // const minX = Math.min(x1, x2);
      // const minY = Math.min(y1, y2);
      // const maxX = Math.max(x1, x2);
      // const maxY = Math.max(y1, y2);
      // return x >= minX && x <= maxX && y >= minY && y <= maxY;

      const left = Math.min(x1, x2);
      const right = Math.max(x1, x2);
      const top = Math.min(y1, y2);
      const bottom = Math.max(y1, y2);

      const nearLeft = Math.abs(mx - left) <= threshold && my >= top && my <= bottom;
      const nearRight = Math.abs(mx - right) <= threshold && my >= top && my <= bottom;
      const nearTop = Math.abs(my - top) <= threshold && mx >= left && mx <= right;
      const nearBottom = Math.abs(my - bottom) <= threshold && mx >= left && mx <= right;

      return nearLeft || nearRight || nearTop || nearBottom;
    } else if (type == "line") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x: mx, y: my };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset) < threshold / threshold;
    }
  };

  function getElementAtPosition(x, y) {
    return allElements.find(element => isWithinElement(x, y, element))
  }

  // update any element
  function updateElement(id, properties, type) {
    const updatedElement = createElement(id, properties, type);
    setAllElements(pre => pre.map((elm, i) => i === id ? updatedElement : elm));
  }

  // mouse down
  function handleMouseDown(event) {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY);
      if (element) {
        const offset = {
          offsetX: clientX - element.properties.x1,
          offsetY: clientY - element.properties.y1
        }
        console.log(element);
        console.log(offset);
        setSelectedElement({ ...element, offset });
        setAction("moving");
      }
    } else {
      const id = allElements.length;
      const properties = {
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
      }
      const element = createElement(id, properties, tool);
      setAllElements(previousState => [...previousState, element]);
      setAction("drawing");
    }
  }

  // mouse move
  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    if (action === "moving") {
      const { id, properties, type, offset } = selectedElement;
      const { x1, y1, x2, y2, width, height } = properties;
      const { offsetX, offsetY } = offset;

      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      const updatedCoordinate = {
        x1: newX,
        y1: newY,
        x2: newX + width,
        y2: newY + height
      }
      updateElement(id, updatedCoordinate, type);
    }
    else if (action === "drawing") {
      const id = allElements.length - 1;
      const { x1, y1 } = allElements[id].properties;

      const updatedCoordinate = {
        x1: x1,
        y1: y1,
        x2: clientX,
        y2: clientY,
        width: Math.abs(clientX - x1),
        height: Math.abs(clientY - y1),
      }
      updateElement(id, updatedCoordinate, tool);
    }
  }

  // mouse up
  function handleMouseUp(event) {
    const index = allElements.length - 1;
    const { x1, y1, x2, y2 } = allElements[index].properties;
    if (x1 === x2 && y1 === y2) {
      setAllElements(prev => prev.filter((elm, i) => i !== index));
    }

    setAction("none");
    setSelectedElement(null);
  }

  return (
    <>
      <div className='fixed'>
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
      <canvas ref={canvasRef}
        className="bg-white"
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas here</canvas>
    </>
  )
}

export default Canvas