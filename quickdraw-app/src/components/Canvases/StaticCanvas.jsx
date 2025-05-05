import React, { useRef, useEffect } from 'react'
import rough from 'roughjs';
// store
import { useCanvasStore, useHistoryStore } from '@Store/canvas';

// functions
import { getStroke } from 'perfect-freehand'
import { pointsOnBezierCurves } from 'points-on-curve';
import { getSvgPathFromStroke } from '@utils/global'


const drawElement = (rc, ctx, element) => {
  const { type, points } = element;

  // feature line curve in future
  if (type === "future-line") {
    const { x1, x2, y1, y2 } = element;
    const curve = [[x1, y1], [x1 + 500, y1], [x2, y2], [x2, y2]];
    const p1 = pointsOnBezierCurves(curve);
    rc.curve(p1, { roughness: 0 });
    return;
  }

  if (type === "line" || type === "rectangle" || type === "ellipse") {

    rc.draw(element.roughElement);

  } else if (type === "freedraw") {

    const stroke = getSvgPathFromStroke(getStroke(points))
    ctx.fill(new Path2D(stroke))

  } else if (type === "text") {

    const { x1, y1, text } = element;
    // ctx.textBaseline = "top";
    ctx.fillText(text, x1, y1);

    // ctx.fillRect(x1, y1, xNew, 24);

  }
}

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
        className="fixed z-[1]"
        width={canvasSize.width}
        height={canvasSize.height}
      >Static Canvas here</canvas></>
  )
}

export default StaticCanvas