import React, { useState } from 'react'
import { useCanvasStore } from '@stores/canvas';
import { useThemeStore } from '@stores/theme.js'
import {
  sideBarIcon,
  optionsIcon
} from './icons'
import BtnIcon from './buttons/BtnIcon';
import MenuBar from './topbar/MenuBar';
import OptionsBar from './topbar/OptionsBar';

function TopBar({ canvasRef }) {
  const { theme } = useThemeStore();

  const { tool } = useCanvasStore();

  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false)
  const [isPropertiesBarOpen, setIsPropertiesBarOpen] = useState(false)
  return (
    <>
      <div className={`TopBar ${theme}-TopBar`}>
        <BtnIcon
          onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}
          className={`${theme}-BtnIcon`}
        > {sideBarIcon}
        </BtnIcon>

        {tool !== "eraser" && <BtnIcon
          onClick={() => setIsPropertiesBarOpen(!isPropertiesBarOpen)}
          className={`${theme}-BtnIcon`}
        > {optionsIcon}
        </BtnIcon>}

        <MenuBar
          canvasRef={canvasRef}
          theme={theme}
          className={`${isMenuBarOpen ? null : 'translate-x-[-220px]'} 
            transition-transform duration-300 `}
        />

        {tool !== "eraser" && <OptionsBar
          theme={theme}
          className={`${isPropertiesBarOpen ? null : 'translate-x-[300px]'} 
            transition-transform duration-300 `}
        />}
      </div>


    </>
  )
}

export default TopBar