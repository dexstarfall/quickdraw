import React from 'react'

function BtnMenuAction({
  children,
  currentTheme,
  className = '',
  ...props
}) {
  return (
    <button
      className={`BtnMenuAction theme-effect-1
        w-full p-2
        flex items-center gap-2
        text-left
        rounded-lg 
        ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default BtnMenuAction