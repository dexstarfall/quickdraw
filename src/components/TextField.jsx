import React, { useEffect, useRef } from 'react'
// store
import {
  useOptionsStore,
  useCanvasStore,
  useHistoryStore
} from '@stores/canvas';
import { updateElement } from '@engine/elementRelated';

function TextField({ staticCanvasRef }) {


  const undo = useHistoryStore((s) => s.undo);
  const elements = useHistoryStore((s) => s.getCurrentState());
  const setElements = useHistoryStore((s) => s.setHistory);

  const { action, selectionElement, scale, scaleOffset, panOffset,
    setAction, setSelectionElement, } = useCanvasStore();

  const { strokeColor, strokeWidth } = useOptionsStore();

  const textAreaRef = useRef();
  if (!selectionElement) return null;

  const fontSize = 15 + (strokeWidth - 1) * 6;
  
  
  
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

  // when text area is out of focus
  const handleBlur = () => {
    const { id, type, x1, y1 } = selectionElement;
    const ctx = staticCanvasRef.current.getContext('2d')

    ctx.textBaseline = "top";
    const font = `${fontSize}px consolas`;
    ctx.font = font;

    const text = textAreaRef.current.value;
    const x2 = x1 + ctx.measureText(text).width;
    const y2 = y1 + parseInt(fontSize);

    const options = { id, type, x1, y1, x2, y2, text, font }
    const updatedElement = updateElement(elements[id], options);
    setElements((pre => pre.map((elm, i) => i === id ? updatedElement : elm)), true);
    setAction("none");
    setSelectionElement(null);

    if (selectionElement.text === options.text) {
      undo();
    }
    // persist text elements
    useCanvasStore.getState().setElements(useHistoryStore.getState().getCurrentState()); // Corrected

  }

  const textAreaFont = `${fontSize * scale}px consolas`
  const left = (selectionElement.x1 + panOffset.x) * scale - scaleOffset.x;
  const top = (selectionElement.y1 + panOffset.y - 3) * scale - scaleOffset.y;
  return (
    <>
      <textarea
        ref={textAreaRef}
        onBlur={handleBlur}
        className="fixed z-[3] bg-transparent outline-0 resize-none 
        break-words overflow-hidden whitespace-pre"
        style={{ font: textAreaFont, left, top, color: strokeColor }}
      > </textarea>

    </>
  )
}

export default TextField