import React from 'react'
import {
  menuBarIcon

} from './icons'

function MenuBar(prop) {

  const downloadCanvas = (canvasRef, filename = "drawing.png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  return (
    <>
      <div className="bg-[#1d1d1d] w-fit mx-auto overflow-hidden
    absolute left-0 top-0 rounded-xl
    flex gap-2  shadow-lg ">
        <button
          className={`btn-hover1
              w-[40px] h-[40px] btn-pointer pointer-events-auto
              flex justify-center items-center
              text-center`}
        >
          {menuBarIcon}
        </button>
      </div>

      <div className='bg-[#1d1d1d] w-[200px] h-[200px] text-white p-2
                       absolute top-[50px] left-0 z-[10] 
                       flex flex-col gap-2
                       rounded-xl'  >
        <button
          onClick={() => downloadCanvas(prop.canvasRef, "quickdrawCanvas.png")}
          className='w-[100%] bg-neutral-800 rounded-lg py-1 px-2 pointer-events-auto
                      text-left '>
          Export as Image
        </button>
        <button className='w-[100%] bg-neutral-800 rounded-lg py-1 px-2 text-left '>
          more feature(Login)
        </button>
      </div>
    </>

  )
}

export default MenuBar