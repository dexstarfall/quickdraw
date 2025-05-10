import React from 'react'
// store
import {
  useCanvasStore,
  useHistoryStore,
  usePropertiesStore
} from '@stores/canvas';
// functionality
import { nearPoint } from '@utils/math'
import { onCorner, onRectangle, onLine, onEllipse } from '@utils/mouseOnShape'
import { createElement, updateElement } from '@actions/elementRelated';

// Logic for
// positionOnElement - onShape, start, end, tl, tr, bl, br
// -------------------------------------------------------

// when no shape is selected check -> 'click' on 'edge of element'
const positionOnElement = (mx, my, element) => {
  const { type, x1, y1, x2, y2 } = element;

  if (type === "rectangle") {

    const onRectangleCorner = onCorner(mx, my, x1, y1, x2, y2)
    const on = onRectangle(mx, my, x1, y1, x2, y2);
    return onRectangleCorner || on;

  } else if (type === "line") {
    const start = nearPoint(mx, my, x1, y1, "start");
    const end = nearPoint(mx, my, x2, y2, "end");

    const on = onLine(mx, my, x1, y1, x2, y2);
    return start || end || on;

  } else if (type === "ellipse") {

    const onEllipseCorner = onCorner(mx, my, x1, y1, x2, y2);
    const on = onEllipse(mx, my, x1, y1, x2, y2);
    return onEllipseCorner || on;

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
}
// if adjusment required passed ajust coordinates
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
  } else if (type === "ellipse") {
    return { x1: minX, y1: minY, x2: maxX, y2: maxY, };
  }
}
// coordinates after resize
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
// cursor name according to cursor position
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
function InteractiveCanvas(
  { interactiveCanvasRef, canvasSize, pressedKeys }
) {
  const { strokeColor, strokeWidth } = usePropertiesStore();

  const {
    tool, action, scale, scaleOffset, panOffset, startPanPosition, selectionElement,
    setPanOffset, setAction, setStartPanPosition, setSelectionElement
  } = useCanvasStore();

  const elements = useHistoryStore((s) => s.getCurrentState());
  const setElements = useHistoryStore((s) => s.setHistory);
  const { getCurrentState, undo } = useHistoryStore();

  // return element at position
  const getElementAtPosition = (x, y) => {
    return elements
      .map(element => ({ ...element, position: positionOnElement(x, y, element) }))
      .find(element => element.position !== null);
  }
  // get mouse coordinates according to the scale and offset
  const getMouseCoordinates = event => {
    const x = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const y = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
    return { x, y }
  }
  const moveElement = (element, newPoints) => {
    const { id, type } = element;
    let movedElement;
    if (type === "freedraw") {
      movedElement = { ...element, points: newPoints };
    } else if (type === "text") {
      const { x1, y1, x2, y2 } = newPoints
      const options = { strokeColor, strokeWidth }
      movedElement = createElement(id, type, x1, y1, x2, y2, options);
      movedElement.text = element.text;
      movedElement.font = element.font;
    } else {
      const { x1, y1, x2, y2 } = newPoints
      const options = {
        strokeColor: element.strokeColor,
        strokeWidth: element.strokeWidth
      }
      movedElement = createElement(id, type, x1, y1, x2, y2, options);
    }
    return movedElement;
  }
  // mouse down
  const handlePointerDown = (event) => {
    const { x: mouseX, y: mouseY } = getMouseCoordinates(event);
    if (event.button === 1 || pressedKeys.has(" ")) {
      setStartPanPosition({ x: mouseX, y: mouseY });
      setAction("panning")
      return;
    }

    if (action === "writing") {
      return;
    }

    if (tool === "selection") {
      if (event.button === 0) {
        const element = getElementAtPosition(mouseX, mouseY);
        if (element) {
          if (element.type === "freedraw") {
            const xOffsets = element.points.map(point => mouseX - point.x);
            const yOffsets = element.points.map(point => mouseY - point.y);
            setSelectionElement({ ...element, xOffsets, yOffsets });
          } else {
            const offsetX = mouseX - element.x1;
            const offsetY = mouseY - element.y1;
            setSelectionElement({ ...element, offsetX, offsetY });
          }
          setElements(pre => pre);

          if (element.position === "onShape") {
            setAction("moving");
          } else {
            setAction("resizing");
          }
        }
      }
    } else if (tool === "text") { // when already written text is selected again
      const element = getElementAtPosition(mouseX, mouseY);

      if (element && element.type == "text") {
        const { x1, y1 } = element;
        const offsetX = mouseX - element.x1;
        const offsetY = mouseY - element.y1;
        setSelectionElement({ ...element, offsetX, offsetY });
        if (mouseX - offsetX === x1 && mouseY - offsetY === y1) {
          setAction("writing");
          return;
        }
      }
      // text elm creation here
      const id = elements.length;
      const options = { strokeColor, strokeWidth }
      const newElement = createElement(id, tool, mouseX, mouseY, mouseX, mouseY, options);
      setElements(pre => [...pre, newElement]);
      setSelectionElement(newElement);
      setAction("writing");

    } else if (["freedraw", "line", "rectangle", "ellipse"].includes(tool)) { // when tool not selection
      // shape element creation here - line, rect, ellipse
      const id = elements.length;
      const options = { pressure: event.pressure, strokeColor, strokeWidth }
      const newElement = createElement(id, tool, mouseX, mouseY, mouseX, mouseY, options);
      setElements(pre => [...pre, newElement]);
      setSelectionElement(newElement);
      setAction("drawing");

    } else if (tool === "hand") {
      setStartPanPosition({ x: mouseX, y: mouseY });
      setAction("panning")
    } else if (tool === "eraser") {
      setAction("erasing")
    }
    else {
      return
    }
  }
  // on mouse move
  const handlePointerMove = (event) => {
    // console.log(event.pressure)
    const { x: mouseX, y: mouseY } = getMouseCoordinates(event);

    // tools-> UX
    if (tool === "selection") {
      const element = getElementAtPosition(mouseX, mouseY);

      if (element) {
        event.target.style.cursor = cursorForPosition(element.position);
      } else {
        event.target.style.cursor = "default";
      }
    } else if (tool == "hand") {
      event.target.style.cursor = "grab";
    } else if (tool == "text") {
      const element = getElementAtPosition(mouseX, mouseY);
      if (element) {
        event.target.style.cursor = "text";
      } else {
        event.target.style.cursor = "crosshair";
      }
    } else if (["freedraw", "line", "rectangle", "ellipse", "eraser"].includes(tool)) {
      event.target.style.cursor = "crosshair";
    } else {
      event.target.style.cursor = "default";
    }

    if (action === "drawing") {

      const id = elements.length - 1;
      const { type, x1, y1 } = elements[id];

      const options = {
        id, type, x1, y1,
        x2: mouseX,
        y2: mouseY,
        pressure: event.pressure,
      };
      const updatedElement = updateElement(elements[id], options);
      setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);

    } else if (action === "moving") {

      const { id, type } = selectionElement;
      let newPoints;
      if (type === "freedraw") {

        const { points, xOffsets, yOffsets } = selectionElement;
        newPoints = points.map((_, i) => ({
          x: mouseX - xOffsets[i],
          y: mouseY - yOffsets[i],
        }))

      } else if (["line", "rectangle", "ellipse", "text"].includes(type)) {

        const { offsetX, offsetY, width, height } = selectionElement;
        const newX1 = mouseX - offsetX;
        const newY1 = mouseY - offsetY;
        newPoints = {
          x1: newX1, y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height
        }

      }
      const movedElement = moveElement(elements[id], newPoints);
      setElements((pre => pre.map((elm, i) => i === id ? movedElement : elm)), true);

    } else if (action === "resizing") {

      const { id, type, position, ...coordiantes } = selectionElement;
      const { x1, y1, x2, y2 } = resizeCoordinates(mouseX, mouseY, position, coordiantes);
      const content = { id, type, x1, y1, x2, y2 };
      const updatedElement = updateElement(elements[id], content);
      setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);

    } else if (action === "panning") {

      const deltaX = mouseX - startPanPosition.x;
      const deltaY = mouseY - startPanPosition.y;
      setPanOffset(pre => ({
        x: pre.x + deltaX,
        y: pre.y + deltaY

      }))
      return;
    } else if (action === "erasing") {
      const element = getElementAtPosition(mouseX, mouseY);
      if (element) {
        // setElements((pre => pre.filter((_, i) => i != element.id)));
        setElements((pre => pre.filter(elm => elm.id !== element.id)));
      }
    }
    // console.log(elements)
  }

  // on mouse up
  const handlePointerUp = () => {
    if (["none"].includes(action)) return;

    if (selectionElement) {
      const index = elements.length - 1;
      const { id, type, x1, y1, x2, y2 } = elements[index];

      if (["line", "rectangle", "ellipse"].includes(type)) {
        if (action === "drawing") {

          const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);
          const content = { id, type, x1, y1, x2, y2 };
          const updatedElement = updateElement(elements[id], content);
          setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);

        } else if (action === "resizing") {

          const { x1, y1, x2, y2 } = adjustCoordinates(elements[id]);
          const content = { id, type, x1, y1, x2, y2 };
          const updatedElement = updateElement(elements[id], content);
          setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);

        }
        if (x1 === x2 && y1 === y2) {
          undo();
        }
      } else if (type === "text") {
        if (action === "writing") return;
      }
    }
    // persist all elements
    useCanvasStore.getState().setElements(getCurrentState());

    setAction("none");
    setSelectionElement(null);

  }

  return (
    <>
      <canvas
        ref={interactiveCanvasRef}
        className="fixed z-[2]"
        width={canvasSize.width}
        height={canvasSize.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >Static Canvas here</canvas></>
  )
}

export default InteractiveCanvas