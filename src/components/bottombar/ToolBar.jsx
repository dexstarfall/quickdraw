import React from 'react'
// stores
import BtnTool from '../buttons/BtnTools';
import { useCanvasStore } from '@stores/canvas';

import {
  selectionIcon,
  handIcon,
  freedrawIcon,
  lineIcon,
  ellipseIcon,
  rectangleIcon,
  textIcon,
  eraserIcon,
} from '../icons'

function ToolBar({
  theme,
}) {
  const { tool, setTool } = useCanvasStore();

  // Tool list with name and corresponding icon
  const toolList = [
    { name: 'selection', icon: selectionIcon },
    { name: 'hand', icon: handIcon },
    { name: 'freedraw', icon: freedrawIcon },
    { name: 'line', icon: lineIcon },
    { name: 'rectangle', icon: rectangleIcon },
    { name: 'ellipse', icon: ellipseIcon },
    { name: 'text', icon: textIcon },
    { name: 'eraser', icon: eraserIcon },
  ];

  return (
    <div
      className={`pointer-events-auto
      w-fit mx-auto p-2
      absolute bottom-0 left-[50%] translate-x-[-50%]
      flex gap-2 rounded-xl shadow-neutral-950 ${theme}-ToolBar`}>

      {toolList.map(({ name, icon }) => (
        <BtnTool
          key={name}
          name={name}
          isActive={tool == name}
          className={`${theme}-BtnTool
          ${theme}-BtnTool-${tool == name ? `selected` : `notSelected`} `}
          onChange={() => setTool(name)}
        >
          {icon}
        </BtnTool>
      ))}
    </div>
  )
}

export default ToolBar