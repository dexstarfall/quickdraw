import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';

let generator = rough.generator();

function generateSeed() {
  return Math.floor(Math.random() * (2 ** 31 - 1)) + 1;
}

function createElement(coordinate, tool) {

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

  const propeties = {
    ...prop1,
    stroke: 'lightcoral',
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };

  const { x1, y1, x2, y2 } = coordinate;
  const height = y2 - y1;
  const width = x2 - x1;

  let roughElement = {};
  let boundingBox = {}
  if (tool === "line") {

    boundingBox = { LTx1: x1, LTy1: y1, RBbx2: x2, RBy2: y2 }

    const boundingBox = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    };
    


    roughElement = generator.line(x1, y1, x2, y2, propeties);
  } else if (tool === "rectangle") {
    roughElement = generator.rectangle(x1, y1, width, height, propeties);
  } else if (tool === "circle") {
    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, propeties);
  }

  return { coordinate, roughElement, boundingBox };
}


function Canvas() {
  const canvasRef = useRef(null);

  const [action, setAction] = useState("none");
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("line");

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // moving and element
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });



  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));

  }, [canvasSize, elements]);

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

  function handleMouseDown(event) {
    const { clientX, clientY } = event;
    if (tool === "selection") {
      // if object -- selected -- can move
    } else {
      const coordinate = { x1: clientX, y1: clientY, x2: clientX, y2: clientY }
      const element = createElement(coordinate, tool);
      setElements(previousState => [...previousState, element]);
      setAction("drawing");
    }
  }

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index].coordinate;
      const coordinate = { x1: x1, y1: y1, x2: clientX, y2: clientY }
      const newElement = createElement(coordinate, tool);
      setElements(pElm => pElm.map((elm, i) => i === index ? newElement : elm));

    }
  }

  function handleMouseUp(event) {
    const index = elements.length - 1;
    const { x1, y1, x2, y2 } = elements[index].coordinate;
    console.log(x1, y1, x2, y2);
    if (x1 === x2 && y1 === y2) {
      setElements(pElm => pElm.filter((elm, i) => i !== index));
    }
    setAction("none");
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

        <input type="radio" name="circle" id="circle"
          checked={tool === "circle"}
          onChange={() => setTool("circle")}
        />
        <label htmlFor="circle">Circle</label>
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