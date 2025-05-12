import React from 'react'
function BtnTool({
  children,
  name,
  isActive,
  className = '',
  ...prop

}) {
  return (
    <label >
      <input
        type="radio"
        name="tool"
        value={name}
        checked={isActive}
        className="hidden"
        {...prop}
      />
      <div className={`BtnTool ${className}`}>
        {children}
      </div>
    </label>
  )
}

export default BtnTool