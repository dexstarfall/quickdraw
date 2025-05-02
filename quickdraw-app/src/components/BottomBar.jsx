import React, { useEffect } from 'react'

function BottomBar(
  { handleZoom,
    undo, redo,
    scale,
    setScale,
  }
) {
  // undo redo functionality
  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  return (
    <>
      <div className="fixed z-[3] bottom-4 left-4">
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          onClick={() => handleZoom(-0.1)}>-</button>
        <button className="bg-blue-200 p-2 m-1 rounded-lg"
          // onClick={() => setScale(1)}> {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          onClick={() => setScale(1)}> {(scale * 100).toFixed(0) + "%"}
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