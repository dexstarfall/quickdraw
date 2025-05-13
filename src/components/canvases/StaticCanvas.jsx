import React, { forwardRef, memo, useEffect } from 'react'
import rough from 'roughjs';
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';
import { drawElement } from '@engine/elementRelated';


const StaticCanvas = forwardRef(({ canvasSize }, ref) => {
  const { action, selectionElement, scale, panOffset, scaleOffset } = useCanvasStore();
  const elements = useHistoryStore((s) => s.getCurrentState());

  // overwrite history with initial elements
  useEffect(() => {
    const { elements } = useCanvasStore.getState();
    const { setHistory } = useHistoryStore.getState();
    if (elements && elements.length > 0) {
      setHistory(elements, true);
    }
  }, []);

  useEffect(() => {
    // ctx -> canvasContext, rc -> roughCanvas
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(panOffset.x * scale - scaleOffset.x, panOffset.y * scale - scaleOffset.y);
    ctx.scale(scale, scale);
    elements.forEach(elm => {
      //  when re-editing text hide canvas text
      if (action === "writing" && selectionElement.id === elm.id) return;

      drawElement(rc, ctx, elm)
    });
    ctx.restore();
  }, [canvasSize, elements, action, selectionElement, panOffset, scale]);


  return (
    <canvas
      ref={ref}
      className="fixed z-[1] bg-neutral-900"
      width={canvasSize.width}
      height={canvasSize.height}
    >
    </canvas>
  )
});

export default memo(StaticCanvas);