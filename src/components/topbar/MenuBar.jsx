import React from 'react'
import {
  useHistoryStore,
  useCanvasStore
} from '@stores/canvas';
import { useThemeStore } from '@stores/theme'
import {
  saveCanvasToFile,
  exportCanvasToImage
} from '@engine/fileHandler'
import BtnMenuAction from '../buttons/BtnMenuAction'
import { DownloadIcon, ExtraIcon, LoadCanvasIcon, SaveCanvasIcon } from '../icons';

function MenuBar({
  canvasRef,
  className = '',
  ...props
}) {
  const { theme, setTheme } = useThemeStore();

  const setElements = useHistoryStore((s) => s.setHistory);
  const { getCurrentState } = useHistoryStore();

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
      // Check if the error is an AbortError by user and ignore it 
      if (error.name !== "AbortError") {
        console.error("Failed to load canvas:", error);
      }
    }
  };

  const menuList = [
    { icon: <LoadCanvasIcon />, label: "Load Canvas", action: loadCanvasFromFile },
    { icon: <SaveCanvasIcon />, label: "Save Canvas", action: saveCanvasToFile },
    { icon: <DownloadIcon />, label: "Export As Image", action: () => exportCanvasToImage(canvasRef, "quickdrawCanvas.png") },
    { icon: <ExtraIcon />, label: "Future Features" },
  ]
  return (
    <div
      className={` pointer-events-auto
      w-[200px]  
      p-2
      rounded-xl
      absolute top-12 left-0 
      flex flex-col gap-2 ${className}`} >
      {menuList.map(({ icon, label, action, hover = "" }, index) => (
        <BtnMenuAction
          key={index}
          onClick={action}
        >
          {icon}
          <p>{label}</p>
        </BtnMenuAction>
      ))}

      <p>Theme:</p>


      <div className='flex gap-2 justify-center'>
        {['dark', 'light', 'device'].map((item) => (
          <button
            key={item}
            className={`theme-effect-1 px-2 rounded-md  ${item === theme ? "BtnOptionAction-selected" : null}`}
            onClick={() => setTheme(item)}>
              
            {item !== 'device'? item : 'auto' }
          </button>
        ))}
      </div>
    </div>
  )
}

export default MenuBar