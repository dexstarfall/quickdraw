import React from 'react'
// stores
import BtnTool from '../buttons/BtnTools';
import { useCanvasStore } from '@stores/canvas';
import { EllipseIcon, EraserIcon, FreeDrawIcon, HandIcon, LineIcon, RectangleIcon, SelectionIcon, TextIcon } from '../icons';

function ToolBar({
  theme,
}) {
  const { tool, setTool } = useCanvasStore();

  // Tool list with name and corresponding icon
  const toolList = [
    { name: 'selection', icon: <SelectionIcon /> },
    { name: 'hand', icon: <HandIcon /> },
    { name: 'freedraw', icon: <FreeDrawIcon /> },
    { name: 'line', icon: <LineIcon /> },
    { name: 'rectangle', icon: <RectangleIcon /> },
    { name: 'ellipse', icon: <EllipseIcon /> },
    { name: 'text', icon: <TextIcon /> },
    { name: 'eraser', icon: <EraserIcon /> },
  ];

  return (
    <div
      className={`pointer-events-auto ToolBar`}>

      {toolList.map(({ name, icon }) => (
        <BtnTool
          key={name}
          name={name}
          isActive={tool == name}
          className={`BtnTool theme-effect-1
          BtnTool-${tool == name ? `selected` : null } `}
          onChange={() => setTool(name)}
        >
          {icon}
        </BtnTool>
      ))}
    </div>
  )
}

export default ToolBar