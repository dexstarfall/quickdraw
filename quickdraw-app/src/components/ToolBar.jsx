import React from 'react'
// stores
import { useCanvasStore } from '@stores/canvas';
import Tool from './Tool';

function ToolBar() {
  const { tool, setTool } = useCanvasStore();
  return (
    <>
      {/* <div className="bg-gray-200 p-2 
                    fixed z-[10] top-20 left-[50%] translate-x-[-50%]
                    flex gap-2 rounded-xl">

        <Tool name={"S"} />
        <Tool name={"H"} />
        <Tool name={"P"} />
        <Tool name={"L"} />
        <Tool name={"R"} />
        <Tool name={"T"} />
        <Tool name={"E"} />
      </div> */}

      <div className="fixed z-[3]">
        <input type="radio" name="selection" id="selection"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Select</label>

        <input type="radio" name="hand" id="hand"
          checked={tool === "hand"}
          onChange={() => setTool("hand")}
        />
        <label htmlFor="hand">Hand</label>

        <input type="radio" name="freedraw" id="freedraw"
          checked={tool === "freedraw"}
          onChange={() => setTool("freedraw")}
        />
        <label htmlFor="freedraw">Pencil</label>

        <input type="radio" name="line" id="line"
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>

        <input type="radio" name="rectangle" id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>

        <input type="radio" name="text" id="text"
          checked={tool === "text"}
          onChange={() => setTool("text")}
        />
        <label htmlFor="text">Text</label>

        <input type="radio" name="ellipse" id="ellipse"
          checked={tool === "ellipse"}
          onChange={() => setTool("ellipse")}
        />
        <label htmlFor="ellipse">ellipse</label>

      </div>
    </>
  )
}

export default ToolBar