import React from 'react'

function Container({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`w-fit h-fit flex shadow-sm shadow-neutral-950 rounded-xl ${className}`}
      {...props}>
        {children}
    </div>
  )
}

export default Container