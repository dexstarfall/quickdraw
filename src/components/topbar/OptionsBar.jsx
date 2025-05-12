import { useOptionsStore } from '@stores/canvas';
import { useCanvasStore } from '@stores/canvas';
import BtnOptionAction from '../buttons/BtnOptionAction';
import ContainerBtnOption from '../container/ContainerBtnOption';
function OptionsBar({
  theme,
  className = '',
  ...props
}) {
  const { tool } = useCanvasStore();
  const { strokeColor, fillColor, strokeWidth, fontSize, roughness,
    setStrokeColor, setFillColor, setStrokeWidth, setFontSize, setRoughness
  } = useOptionsStore();

  const strokeColorList = [
    { value: '#F0F3F5' }, // Light Gray
    { value: '#342E37' }, // Dark Gray
    { value: '#ECA400' }, // Yellow
    { value: '#419D78' }, // Green
    { value: '#228CDB' }, // Blue
    { value: '#D91E36' }, // Red
  ];

  const fillColorList = [
    { value: "transparent" },
    { value: "#342E37" },
    { value: "#ECA400" },
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
    <div className={`pointer-events-auto
      w-fit py-2 px-4
      rounded-xl
      absolute top-12 right-0 
      flex flex-col gap-2 ${theme}-OptionsBar ${className}`}
    >
      <p>Stroke Color:</p>
      <ContainerBtnOption>
        {strokeColorList.map(({ value }) => (
          <BtnOptionAction
            key={value}
            current={strokeColor}
            onClick={() => setStrokeColor(value)}
            value={value}
            className={`hover:scale-110 ring inset-ring-1
                        ${theme}-BtnOptionAction-${strokeColor == value ? 'selected' : 'notSelected'}`}
            style={{ backgroundColor: value, }}
          />
        ))}
      </ContainerBtnOption>

      {["rectangle", "ellipse"].includes(tool) && <>
        <p>Fill Color:</p>
        <ContainerBtnOption>
          {fillColorList.map(({ value, label }) => (
            <BtnOptionAction
              key={value}
              current={fillColor}
              value={value}
              onClick={() => setFillColor(value)}
              className={`hover:scale-110 ring inset-ring-1
            ${theme}-BtnOptionAction-${fillColor == value ? 'selected' : 'notSelected'}`}
              style={{ backgroundColor: value, }}
            >
              {label && <p>{label}</p>}  {/* Render label if present */}
            </BtnOptionAction>
          ))}
        </ContainerBtnOption>
      </>}

      <p>Stroke Width:</p>
      <ContainerBtnOption>
        {strokeWidthList.map(({ value, label }) => (
          <BtnOptionAction
            key={value}
            current={strokeWidth}
            value={value}
            className={`${theme}-BtnOptionAction-${strokeWidth === value ? 'selected' : 'notSelected'}`}
            onClick={() => setStrokeWidth(value)}
          >
            <p>{label}</p>
          </BtnOptionAction>
        ))}
      </ContainerBtnOption>

      {/* <p>Font Size:</p>
      <ContainerBtnOption>
        {fontSizeList.map(({ value, label }) => (
          <BtnOptionAction
            key={value}
            current={fontSize}
            value={value}
            className={`${theme}-BtnOptionAction-${fontSize == value ? 'selected' : 'notSelected'}`}
            onClick={() => setFontSize(value)}  // Set the font size on click
          >
            <p>{label}</p>
          </BtnOptionAction>
        ))}
      </ContainerBtnOption> */}

      {!(tool === "text" || tool === "freedraw") && <>
        <p>Roughness:</p>
        <ContainerBtnOption>
          {roughnessList.map(({ value, label }) => (
            <BtnOptionAction
              key={value}
              current={roughness}
              value={value}
              className={`w-fit px-2 ${theme}-BtnOptionAction-${roughness == value ? 'selected' : 'notSelected'}`}
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