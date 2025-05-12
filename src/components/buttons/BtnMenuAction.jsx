import React from 'react'

function BtnMenuAction({
  children,
  currentTheme,
  className = '',
  ...props
}) {
  return (
    <button
      className={`BtnMenuAction ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default BtnMenuAction