import { useOptionsStore, useCanvasStore } from '@stores/canvas';
import { useThemeStore } from '@stores/theme'

import BtnOptionAction from '../buttons/BtnOptionAction';
import ContainerBtnOption from '../container/ContainerBtnOption';
import { useEffect, useState } from 'react';
function OptionsBar({
  className = '',
  ...props
}) {
  const { tool } = useCanvasStore();
  const { strokeColor, fillColor, strokeWidth, fontSize, roughness,
    setStrokeColor, setFillColor, setStrokeWidth, setFontSize, setRoughness
  } = useOptionsStore();
  const { theme } = useThemeStore();

  const [strokeColorPicker, setStrokeColorPicker] = useState("transparent");
  const [fillColorPicker, setFillColorPicker] = useState("transparent");

  const strokeColorList = [
    { value: theme === 'dark' ? '#F0F3F5' : "#121212" }, // Light Gray
    { value: '#808080' }, // Dark Gray
    { value: '#419D78' }, // Green
    { value: '#228CDB' }, // Blue
    { value: '#D91E36' }, // Red
  ];

  const fillColorList = [
    { value: "transparent" },
    { value: "#808080" },
    { value: "#0B7A75" },
    { value: "#192A51" },
    { value: "#841C26" },
  ];

  const strokeWidthList = [
    { value: 1, label: "S" },  // Small
    { value: 2, label: "M" },  // Medium
    { value: 3, label: "L" },  // Large
  ];

  const fontSizeList = [
    { value: 15, label: "S" },   // Small
    { value: 20, label: "M" },   // Medium
    { value: 25, label: "L" },   // Large
    { value: 32, label: "XL" },  // Extra Large
  ];

  const roughnessList = [
    { value: 1, label: "Low" },   // Low Roughness
    { value: 2, label: "Mid" },   // Medium Roughness
    { value: 3, label: "Heavy" }, // High Roughness
  ];

  return (
    <div className={` pointer-events-auto
      w-[200px]  
      p-2
      rounded-xl
      absolute top-12 left-0 
      flex flex-col gap-2 ${className}`} >
      <p>Stroke Color:</p>
      <ContainerBtnOption>
        {strokeColorList.map(({ value }) => (
          <BtnOptionAction
            key={value}
            current={strokeColor}
            onClick={() => setStrokeColor(value)}
            value={value}
            className={`hover:scale-110
            BtnOptionAction-${strokeColor == value ? 'selected' : null}`}
            style={{ backgroundColor: value, }}
          />
        ))}

        <div className="ml-3 w-6 h-6 relative overflow-hidden rounded-sm border-[3px]">
          <input type="color" id="colorPicker1"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => { setStrokeColorPicker(e.target.value); setStrokeColor(e.target.value) }}
          />
          <label htmlFor="colorPicker1"
            className="block w-full h-full"
            style={{ backgroundColor: strokeColorPicker }}
          ></label>
        </div>

      </ContainerBtnOption>

      {["rectangle", "ellipse"].includes(tool) && <>
        <p>Fill Color:</p>
        <ContainerBtnOption>
          {fillColorList.map(({ value }) => (
            <BtnOptionAction
              key={value}
              current={fillColor}
              value={value}
              onClick={() => setFillColor(value)}
              className={`hover:scale-110
              BtnOptionAction-${fillColor == value ? 'selected' : null}`}
              style={{ backgroundColor: value, }}
            >
              {value === "transparent" ? <p>T</p> : null}
            </BtnOptionAction>
          ))}
          <div className="ml-3 w-6 h-6 relative overflow-hidden rounded-sm border-[3px]">
            <input type="color" id="colorPicker1"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => { setFillColorPicker(e.target.value); setFillColor(e.target.value) }}
            />
            <label htmlFor="colorPicker1"
              className="block w-full h-full"
              style={{ backgroundColor: fillColorPicker }}
            ></label>
          </div>
        </ContainerBtnOption>
      </>}
      {!(tool === "text") && <>
        <p>Stroke Width:</p>
        <ContainerBtnOption>
          {strokeWidthList.map(({ value, label }) => (
            <BtnOptionAction
              key={value}
              current={strokeWidth}
              value={value}
              className={`BtnOptionAction-${strokeWidth === value ? 'selected' : null}`}
              onClick={() => setStrokeWidth(value)}
            >
              <p>{label}</p>
            </BtnOptionAction>
          ))}
        </ContainerBtnOption>
      </>}

      {(tool === "text") && <>
        <p>Font Size:</p>
        <ContainerBtnOption>
          {fontSizeList.map(({ value, label }) => (
            <BtnOptionAction
              key={value}
              current={fontSize}
              value={value}
              className={`BtnOptionAction-${fontSize == value ? 'selected' : null}`}
              onClick={() => setFontSize(value)}  // Set the font size on click
            >
              <p>{label}</p>
            </BtnOptionAction>
          ))}
        </ContainerBtnOption>
      </>}

      {!(tool === "text" || tool === "freedraw") && <>
        <p>Roughness:</p>
        <ContainerBtnOption>
          {roughnessList.map(({ value, label }) => (
            <BtnOptionAction
              key={value}
              current={roughness}
              value={value}
              className={`w-fit px-2 BtnOptionAction-${roughness == value ? 'selected' : null}`}
              onClick={() => setRoughness(value)}  // Set roughness on click
            >
              <p>{label}</p>
            </BtnOptionAction>
          ))}
        </ContainerBtnOption>
      </>}
    </div>

  )
}

export default OptionsBar