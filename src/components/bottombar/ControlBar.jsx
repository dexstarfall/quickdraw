import React, { useEffect, useState } from 'react';
import { useCanvasStore, useHistoryStore } from '@stores/canvas';
import { DeleteAllIcon, RedoIcon, ResetCanvasIcon, UndoIcon, ZoomInIcon, ZoomOutIcon } from '../icons'
import BtnIcon from '../buttons/BtnIcon'
import Container from '../container/container'

function ControlBar({ canvasRef }) {

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

    const cR = canvasRef.current;
    const scaleOffsetX = (cR.width / 2) * (currScale - 1);
    const scaleOffsetY = (cR.height / 2) * (currScale - 1);
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
  }

  const deleteAllElements = () => {
    useHistoryStore.getState().deleteAllElements()
    setConfirmDelete(false)
  }

  return (
    <div className={`w-full
    absolute left-0 bottom-0
    flex gap-2 justify-between items-end`}>
      <div className='flex flex-col-reverse gap-2 lg:flex-row '>
        <Container>
          <BtnIcon
            onClick={() => handleZoom(-0.1)}
            className={`rounded-r-none`}
            title="Zoom Out"
          > <ZoomOutIcon />
          </BtnIcon>


          <BtnIcon
            onClick={() => handleZoom(0, true)}
            className={`rounded-none w-[50px]`}

            title="Reset to 100%"
          > <p>{(scale * 100).toFixed(0) + "%"}</p>
          </BtnIcon>

          <BtnIcon
            onClick={() => handleZoom(0.1)}
            className={`rounded-l-none `}

            title="Zoom In"
          > <ZoomInIcon />
          </BtnIcon>
        </Container>

        <Container>
          <BtnIcon
            onClick={undo}
            className={`rounded-r-none`}

            title="Undo"
          > <UndoIcon />
          </BtnIcon>

          <BtnIcon
            onClick={redo}
            className={`rounded-l-none`}

            title="Redo"
          > <RedoIcon />
          </BtnIcon>
        </Container>
      </div>

      <Container>
        <BtnIcon
          onClick={() => setPanOffset({ x: 0, y: 0 })}
          className={`rounded-r-none`}
          title="Reset Board"
        > <ResetCanvasIcon />
        </BtnIcon>

        <BtnIcon
          onClick={() => setConfirmDelete(true)}
          className={`rounded-l-none`}
          title="Delete All Elements"
        > <DeleteAllIcon />
        </BtnIcon>
      </Container>

      {confirmDelete &&
        <div className='text-lg z-10
                      p-4 rounded-xl pointer-events-auto
                      absolute bottom-0 right-0
                      
                      shadow-light-1-md
                      bg-white
                      dark:bg-neutral-900
                      '  >
          <p className='mb-2'>Remove all elements?</p>
          <div className='flex gap-2 justify-evenly'>
            <button onClick={deleteAllElements}
              className='px-2  rounded-md
              
              theme-effect-1
              shadow-light-1-sm
              dark:shadow-dark-1-sm'>
              Yes
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className='px-2 rounded-md

              theme-effect-1
              shadow-light-1-sm
              dark:shadow-dark-1-sm'>
              No
            </button>
          </div>
        </div>}

    </div >
  )
}

export default ControlBar