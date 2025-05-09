import React, { useEffect, useState } from 'react';
// store
import { useCanvasStore, useHistoryStore } from '@stores/canvas';
import BtnControl from './buttons/BtnControl';
import BtnControl2 from './buttons/BtnControl2';

// icons
import {
  undoIcon, redoIcon,
  zoomInIcon, zoomOutIcon,
  deleteAllIcon
} from "./icons"

function ControlBar(prop) {
  const { scale, setScaleOffset, setScale, setPanOffset, panOffset } = useCanvasStore();
  const { undo, redo } = useHistoryStore();
  const [confirmDelete, setConfirmDelete] = useState(false)

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
    const mouseWheelHandler = event => {
      const isZoomShortcut = event.ctrlKey || event.altKey || event.metaKey;
      if (isZoomShortcut) {
        event.preventDefault();
        handleZoom(event.deltaY * -0.004)
      } else {
        if (event.shiftKey) {
          setPanOffset(pre => ({ x: pre.x - event.deltaY, y: pre.y }))
        } else {
          setPanOffset(pre => ({ x: pre.x, y: pre.y - event.deltaY }))
        }
      }
    };
    window.addEventListener("wheel", mouseWheelHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", mouseWheelHandler);
    };
  }, [scale, panOffset]);

  const handleZoom = (delta, reset = false) => {
    if (reset) {
      setScale(1);
      setScaleOffset({ x: 0, y: 0 });
      return;
    }

    const currScale = Math.min(Math.max(scale + delta, 0.1), 10);
    setScale(currScale);

    const canvasRef = prop.canvasRef.current;
    const scaleOffsetX = (canvasRef.width / 2) * (currScale - 1);
    const scaleOffsetY = (canvasRef.height / 2) * (currScale - 1);
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
  }

  const deleteAllElements = () => {
    useHistoryStore.getState().deleteAllElements()
    setConfirmDelete(false)
  }

  return (
    <>
      <div className="z-[3] absolute right-0 top-0 flex gap-4">

        <button onClick={() => setConfirmDelete(true)}
          className="bg-neutral-800 text-white w-fit px-2 pointer-events-auto
                    flex items-center
                    rounded-xl shadow-lg overflow-hidden">

          {deleteAllIcon}
        </button>

        <div className="bg-neutral-800 text-white w-fit 
                    flex rounded-xl shadow-lg overflow-hidden">
          <BtnControl2 action={undo} icon={undoIcon} />
          <BtnControl2 action={redo} icon={redoIcon} />
        </div>

        <div className="bg-neutral-800 text-white w-fit 
                    flex gap-2 rounded-xl shadow-lg overflow-hidden">

          <BtnControl
            name={"zoomIn"}
            onClick={() => handleZoom(-0.1)}
            icon={zoomInIcon} />

          <BtnControl
            name={"zoomReset"}
            onClick={() => handleZoom(0, true)}
            content={(scale * 100).toFixed(0) + "%"} />

          <BtnControl
            name={"zoomOut"}
            onClick={() => handleZoom(0.1)}
            icon={zoomOutIcon} />
        </div>

      </div>
      {confirmDelete &&
        <div className='bg-[#1e1e1e] text-[#efefef] text-xl
                      p-4 rounded-xl pointer-events-auto
                      absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'  >
          <p className='mb-4 '>Do you want to remove all elemets?</p>
          <div className='flex gap-2 justify-evenly'>
            <button onClick={deleteAllElements}
              className='bg-[#2e2e2e] px-4 py-2 rounded-xl'>
              Yes
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className='bg-[#2e2e2e] px-4 py-2 rounded-xl'>
              No
            </button>
          </div>
        </div>}
    </>
  )
}

export default ControlBar