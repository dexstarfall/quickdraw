import React, { useEffect } from 'react';
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';

function BottomBar(prop) {
  const { scale, setScaleOffset, setScale } = useCanvasStore();
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  // undo redo functionality
  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener('keydown', undoRedoFunction);
    return () => {
      document.removeEventListener('keydown', undoRedoFunction);
    };
  }, [undo, redo]);

  // zoom functionality
  useEffect(() => {
    const wheelHandler = event => {
      const isZoomShortcut = event.ctrlKey || event.altKey || event.metaKey;
      if (isZoomShortcut) {
        event.preventDefault();
        handleZoom(event.deltaY * -0.004);
      }
    };
    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [scale]);

  const handleZoom = (delta, reset = false) => {
    if (reset) {
      setScale(1);
      setScaleOffset({ x: 0, y: 0 });
      return;
    }

    const currScale = Math.min(Math.max(scale + delta, 0.1), 10);
    setScale(currScale);

    const canvasRef = prop.staticCanvasRef.current;
    const scaleOffsetX = (canvasRef.width / 2) * (currScale - 1);
    const scaleOffsetY = (canvasRef.height / 2) * (currScale - 1);
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
  }

  return (
    <>
      <div className="fixed z-[3] bottom-4 left-4">
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={() => handleZoom(-0.1)}>-</button>
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          // onClick={() => setScale(1)}> {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          onClick={() => handleZoom(0, true)}> {(scale * 100).toFixed(0) + "%"}
        </button>
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={() => handleZoom(0.1)}>+</button>

        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={undo}>Undo</button>

        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={redo}>Redo</button>
      </div>
    </>
  )
}

export default BottomBar