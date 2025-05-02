import React from 'react'

function ToolBar(prop) {
  return (
    <>

      <div className="fixed z-[3]">
        <input type="radio" name="selection" id="selection"
          checked={prop.tool === "selection"}
          onChange={() => prop.setTool("selection")}
        />
        <label htmlFor="selection">Select</label>

        <input type="radio" name="hand" id="hand"
          checked={prop.tool === "hand"}
          onChange={() => prop.setTool("hand")}
        />
        <label htmlFor="hand">Hand</label>

        <input type="radio" name="freedraw" id="freedraw"
          checked={prop.tool === "freedraw"}
          onChange={() => prop.setTool("freedraw")}
        />
        <label htmlFor="freedraw">Pencil</label>

        <input type="radio" name="line" id="line"
          checked={prop.tool === "line"}
          onChange={() => prop.setTool("line")}
        />
        <label htmlFor="line">Line</label>

        <input type="radio" name="rectangle" id="rectangle"
          checked={prop.tool === "rectangle"}
          onChange={() => prop.setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>

        <input type="radio" name="text" id="text"
          checked={prop.tool === "text"}
          onChange={() => prop.setTool("text")}
        />
        <label htmlFor="text">Text</label>

        <input type="radio" name="ellipse" id="ellipse"
          checked={prop.tool === "ellipse"}
          onChange={() => prop.setTool("ellipse")}
        />
        <label htmlFor="ellipse">ellipse</label>

      </div>
    </>
  )
}

export default ToolBar