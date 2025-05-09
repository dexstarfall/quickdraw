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
import BtnColor from './buttons/BtnColor';

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
      <div className="bg-[#1d1d1d] w-fit mx-auto 
                      absolute left-0 top-0 
                      flex gap-2 overflow-hidden
                      rounded-xl shadow-lg ">
        <button onClick={menuBarHandle}
          className={`${isMenuOpen ? "bg-[crimson]" : null}
                      w-[40px] h-[40px] btn-pointer pointer-events-auto
                      flex justify-center items-center
                      text-center
                      `}>
          {menuBarIcon}
        </button>
      </div>

      <div className={` ${isMenuOpen ? '' : 'translate-x-[-220px]'} transition-transform duration-300
                        pointer-events-auto
                        text-white w-[200px]  
                       absolute top-[50px] left-0 z-[10] 
                       flex flex-col gap-2
                       `} >

        <div className='bg-[#1d1d1d] p-2
                          rounded-xl'>
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
        <div className='bg-[#1d1d1d] text-neutral-400
                         p-2 
                        rounded-xl'>
          <p>Stroke Color: </p>
          <div className='
                        flex gap-2 justify-center
                        rounded-xl'>
            <BtnColor color={`white`} />
            <BtnColor color={"grey"} />
            <BtnColor color={"gold"} />
            <BtnColor color={"mediumseagreen"} />
            <BtnColor color={"royalblue"} />
            <BtnColor color={"crimson"} />
          </div>
        </div>


      </div>

    </>

  )
}

export default MenuBar