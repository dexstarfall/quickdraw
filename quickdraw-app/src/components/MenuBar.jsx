import React, { useState } from 'react'
import {
  useHistoryStore,
  useCanvasStore
} from '@stores/canvas';
import {
  saveCanvasToFile,
  exportCanvasToImage
} from '@actions/fileHandler'
import {
  menuBarIcon,
  downloadIcon,
  saveFileIcon,
  loadFileIcon,
  extraIcon
} from './icons'
import BtnMenu from './buttons/BtnMenu';

function MenuBar(prop) {
  const setElements = useHistoryStore((s) => s.setHistory);
  const { getCurrentState } = useHistoryStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuBarHandle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const loadCanvasFromFile = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      const file = await fileHandle.getFile();
      const text = await file.text();
      const parsedElements = JSON.parse(text);
      if (parsedElements) {
        const elms = parsedElements.state.elements;
        setElements(elms);
        useCanvasStore.getState().setElements(getCurrentState);
      }
    } catch (error) {
      console.error("Failed to load canvas:", error);
      alert("Error loading canvas. Please select a valid file.");
    }
  };

  return (
    <>
      <div className="bg-[#1d1d1d] w-fit mx-auto overflow-hidden
                      absolute left-0 top-0 rounded-xl
                      flex gap-2  shadow-lg ">
        <button onClick={menuBarHandle}
          className={`btn-hover1
              w-[40px] h-[40px] btn-pointer pointer-events-auto
              flex justify-center items-center
              text-center`}>
          {menuBarIcon}
        </button>
      </div>

      <div className={` ${isMenuOpen ? '' : 'translate-x-[-220px]'} transition-transform duration-300
                    bg-[#1d1d1d] w-[200px]  text-white p-2
                       absolute top-[50px] left-0 z-[10] 
                       flex flex-col gap-2
                       rounded-xl
                       `} >
        <BtnMenu
          handler={loadCanvasFromFile}
          icon={loadFileIcon}
          text={"Load Canvas"} />
        <BtnMenu
          handler={saveCanvasToFile}
          icon={saveFileIcon}
          text={"Save Canvas"} />

        <BtnMenu
          handler={() => exportCanvasToImage(prop.canvasRef, "quickdrawCanvas.png")}
          icon={downloadIcon}
          text={"Export as image"} />
        <BtnMenu
          icon={extraIcon}
          text={"Future Feature"} />
      </div>
    </>

  )
}

export default MenuBar