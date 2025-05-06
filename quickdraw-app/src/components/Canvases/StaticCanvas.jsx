import React, { useRef, useEffect } from 'react'
import rough from 'roughjs';
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';
import { drawElement } from '@actions/elementRelated';


function StaticCanvas(
  { staticCanvasRef, canvasSize }
) {
  const { action, selectionElement, scale, panOffset, scaleOffset } = useCanvasStore();
  const elements = useHistoryStore((s) => s.getCurrentState());

  useEffect(() => {
    // ctx -> canvasContext, rc -> roughCanvas
    const canvas = staticCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // const scaleWidth = canvas.width * scale;
    // const scaleHeight = canvas.height * scale;
    // const scaleOffsetX = (scaleWidth - canvas.width) / 2;
    // const scaleOffsetY = (scaleHeight - canvas.height) / 2;

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
    <>
      <canvas
        ref={staticCanvasRef}
        className="fixed z-[1] bg-[#121212]"
        width={canvasSize.width}
        height={canvasSize.height}
      >Static Canvas here</canvas></>
  )
}

export default StaticCanvas