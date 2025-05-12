import React, { memo } from 'react'
import { useThemeStore } from '@stores/theme.js'
import TopBar from './TopBar';
import BottomBar from './BottomBar';

function UiLayer({ staticCanvasRef }) {
  const { theme } = useThemeStore();
  let currentTheme;
  if (theme == 'light') {
    currentTheme = 'light-theme'
  } else if (theme == 'dark') {
    currentTheme = 'dark-theme'
  }

  return (
    <div className={`${theme}-UiLayer
        pointer-events-none m-4 
        fixed z-[3] top-0 left-0 right-0 bottom-0
        `}>
      <TopBar canvasRef={staticCanvasRef} />
      <BottomBar canvasRef={staticCanvasRef} />

    </div>
  )
}

export default memo(UiLayer)