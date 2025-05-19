import React from 'react'

function Container({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`Container
      w-fit h-fit flex rounded-xl ${className}`}
      {...props}>
      {children}
    </div>
  )
}

export default Container