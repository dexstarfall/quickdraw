import React from 'react'
import {
  useHistoryStore,
  useCanvasStore
} from '@stores/canvas';
import {
  saveCanvasToFile,
  exportCanvasToImage
} from '@actions/fileHandler'
import {
  downloadIcon,
  saveFileIcon,
  loadFileIcon,
  extraIcon
} from './icons'
import BtnMenu from './buttons/BtnMenu';
function MenuBar() {

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
      console.error("Failed to load canvas:", error);
      alert("Error loading canvas. Please select a valid file.");
    }
  };

  return (
    <div className='pointer-events-auto
    bg-[#1d1d1d] p-2
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
  )
}

export default MenuBar