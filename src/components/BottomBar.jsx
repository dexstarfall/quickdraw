import React, { useState } from 'react'
import { useThemeStore } from '@stores/theme.js'

import ToolBar from './bottombar/ToolBar'

import ControlBar from './bottombar/ControlBar'

function BottomBar({ canvasRef }) {
  const { theme } = useThemeStore();

  return (
    <div className={`
      w-full
    absolute left-0 bottom-0
    flex justify-between ${theme}-BottomBar`}>
      <div className='flex gap-2'>
        <ControlBar
          canvasRef={canvasRef}
          theme={theme} />
        <ToolBar
          theme={theme}
        />
      </div>
    </div>
  )
}

export default BottomBar;