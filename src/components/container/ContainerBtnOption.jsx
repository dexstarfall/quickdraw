import React from 'react'

function ContainerBtnOption({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`flex gap-2 rounded-xl ${className}`}
      {...props}>
        {children}
    </div>
  )
}

export default ContainerBtnOption