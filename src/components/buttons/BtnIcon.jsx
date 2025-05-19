import React from 'react'

function BtnIcon({
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`BtnIcon theme-effect-1
        pointer-events-auto cursor-pointer
      w-[32px] h-[32px] 
      flex justify-center items-center text-center
      rounded-lg ring-inset ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default BtnIcon