import React from 'react'
import { useThemeStore } from '@stores/theme.js'
function BtnOptionAction({
  current,
  value,
  children,
  className = '',
  ...props
}) {
  const { theme } = useThemeStore();

  return (
    <button
      className={`w-6 h-6 rounded-sm ${className} `}
      {...props}
    >
      {children}
    </button>
  )
}

export default BtnOptionAction