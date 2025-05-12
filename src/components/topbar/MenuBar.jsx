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
import {
  downloadIcon,
  loadCanvasIcon,
  saveCanvasIcon,
  extraIcon
} from '../icons'
import BtnMenuAction from '../buttons/BtnMenuAction'

function MenuBar({
  canvasRef,
  theme,
  className = '',
  ...props
}) {
  const { toggleTheme } = useThemeStore();

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
    { icon: loadCanvasIcon, label: "Load Canvas", action: loadCanvasFromFile },
    { icon: saveCanvasIcon, label: "Save Canvas", action: saveCanvasToFile },
    { icon: downloadIcon, label: "Export As Image", action: () => exportCanvasToImage(canvasRef, "quickdrawCanvas.png") },
    { icon: extraIcon, label: "Future Features" },
  ]
  return (
    <div
      className={`
      pointer-events-auto
      w-[200px]  
      p-2
      rounded-xl
      absolute top-12 left-0 
      flex flex-col gap-2 ${theme}-MenuBar ${className}`} >
      {/* <button onClick={toggleTheme}>
        Toggle Theme
      </button> */}

      {menuList.map(({ icon, label, action, hover = "" }, index) => (
        <BtnMenuAction
          key={index}
          onClick={action}
          className={`${theme}-BtnMenuAction hover:bg-[#404040] active:ring active:ring-[crimson]  `}
        >
          {icon}
          <p>{label}</p>
        </BtnMenuAction>
      ))}
    </div>
  )
}

export default MenuBar