import React, { forwardRef, memo, useEffect } from 'react'
import rough from 'roughjs';
// store
import {
  useCanvasStore,
  useHistoryStore,
  useOptionsStore
} from '@stores/canvas';
import { useThemeStore } from '@stores/theme'
import { drawElement } from '@engine/elementRelated';


const StaticCanvas = forwardRef(({ canvasSize }, ref) => {
  const { action, selectionElement, scale, panOffset, scaleOffset } = useCanvasStore();
  const elements = useHistoryStore((s) => s.getCurrentState());

  const { strokeColor, fillColor, strokeWidth, fontSize, roughness,
    setStrokeColor, setFillColor, setStrokeWidth, setFontSize, setRoughness
  } = useOptionsStore();


  const { theme } = useThemeStore();

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

      // according to theme
      const lightColor = "#F0F3F5";
      const darkColor = "#121212";
      switch (theme) {

        case "light":
          if (elm.strokeColor === lightColor) {
            elm.strokeColor = darkColor
            setStrokeColor(darkColor)
          }
          if (elm.roughElement && elm.roughElement.options.stroke === lightColor) {
            elm.roughElement.options.stroke = darkColor;
            setStrokeColor(darkColor)
          }
          break;
        case "dark":
          if (elm.strokeColor === darkColor) {
            elm.strokeColor = lightColor
            setStrokeColor(lightColor)
          }
          if (elm.roughElement && elm.roughElement.options.stroke === darkColor) {
            elm.roughElement.options.stroke = lightColor;
            setStrokeColor(lightColor)
          }
          break;
          default:
          setStrokeColor(lightColor)
      }

      drawElement(rc, ctx, elm)
    });
    ctx.restore();
  }, [canvasSize, elements, action, selectionElement, panOffset, scale, theme]);


  return (
    <canvas
      ref={ref}
      className="fixed z-[1] bg-white dark:bg-neutral-950"
      width={canvasSize.width}
      height={canvasSize.height}
    >
    </canvas>
  )
});

export default memo(StaticCanvas);