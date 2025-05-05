import React, { useEffect, useRef } from 'react'
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';

function TextField(
  { staticCanvasRef, updateElement, }) {

  const textAreaRef = useRef();
  const undo = useHistoryStore((s) => s.undo);

  const { action, selectionElement, scale, scaleOffset, panOffset,
    setAction, setSelectionElement, } = useCanvasStore();

  if (!selectionElement) return null;


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
    const options = {
      text: textAreaRef.current.value
    }
    const ctx = staticCanvasRef.current.getContext('2d')
    ctx.font = `20px consolas`;
    ctx.textBaseline = "top";
    const x2 = x1 + ctx.measureText(options.text).width;
    const y2 = y1 + parseInt(ctx.font, 10);

    updateElement(id, type, x1, y1, x2, y2, options);

    setAction("none");
    setSelectionElement(null);

    if (selectionElement.text === options.text) {
      undo();
    }
  }

  const fontSize = 20 * scale;
  const left = (selectionElement.x1 + panOffset.x) * scale - scaleOffset.x;
  const top = (selectionElement.y1 + panOffset.y - 5.5) * scale - scaleOffset.y;
  return (
    <>
      <textarea
        ref={textAreaRef}
        onBlur={handleBlur}
        className="fixed z-[3] bg-transparent outline-0 resize-none
     break-words overflow-hidden whitespace-pre"
        style={{ font: `${fontSize}px consolas`, left, top }}
      > </textarea>

    </>
  )
}

export default TextField