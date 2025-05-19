import React from 'react'
function BtnOptionAction({
  current,
  value,
  children,
  className = '',
  ...props
}) {

  return (
    <button
      className={`theme-effect-1
        w-6 h-6 rounded-sm ${className} `}
      {...props}
    >
      {children}
    </button>
  )
}

export default BtnOptionAction