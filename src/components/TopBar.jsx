import React, { useState } from 'react'
import { useCanvasStore } from '@stores/canvas';
import { useThemeStore } from '@stores/theme.js'

import BtnIcon from './buttons/BtnIcon';
import MenuBar from './topbar/MenuBar';
import OptionsBar from './topbar/OptionsBar';
import { OptionsIcon, SideBarIcon } from './icons';

function TopBar({ canvasRef }) {
  const { theme } = useThemeStore();

  const { tool } = useCanvasStore();

  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false)
  const [isPropertiesBarOpen, setIsPropertiesBarOpen] = useState(false)
  return (
    <>
      <div className={`
            w-full
            absolute left-0 top-0
            flex gap-2`}>
        <BtnIcon
          onClick={() => {setIsMenuBarOpen(!isMenuBarOpen); setIsPropertiesBarOpen(false);}}
          className={`shadow-light-1-sm  dark:shadow-dark-1-sm`}
        >
          <SideBarIcon />
        </BtnIcon>

        {!(["selection","hand","eraser"].includes(tool)) && <BtnIcon
          onClick={() => {setIsPropertiesBarOpen(!isPropertiesBarOpen); setIsMenuBarOpen(false);} }
          className={`shadow-light-1-sm dark:shadow-dark-1-sm`}
        > <OptionsIcon />
        </BtnIcon>}

        <MenuBar
          canvasRef={canvasRef}
          theme={theme}
          className={`SlideMenu
            ${isMenuBarOpen ? 'duration-300' : 'translate-x-[-220px]'} 
            transition-transform duration-100 `}
        />

        {!(["selection","hand","eraser"].includes(tool)) && <OptionsBar
          className={`SlideMenu
            ${isPropertiesBarOpen ? 'duration-300' : 'translate-x-[-220px]'} 
            transition-transform duration-100`}
        />}
      </div>


    </>
  )
}

export default TopBar