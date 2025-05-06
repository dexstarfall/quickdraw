// BtnControl.js
import React from 'react';
import './buttons.css'

function BtnControl(prop) {
  return (
    <button
      className={`${prop.name !== "zoomReset" ? `btn-hover1` : null}
                  w-[40px] h-[40px] btn-pointer pointer-events-auto
                  flex justify-center items-center
                  text-center `}
      onClick={prop.onClick}
    >
      {prop.icon ? prop.icon :
        <p className="text-sm">
          {prop.content}
        </p>}

    </button>
  );
}

export default BtnControl;
