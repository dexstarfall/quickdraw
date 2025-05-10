import rough from 'roughjs';
import { getFreeDrawDimension } from '@utils/global';

// functions
import { getStroke } from 'perfect-freehand'
import { pointsOnBezierCurves } from 'points-on-curve';
import { getSvgPathFromStroke } from '@utils/global'


let generator = rough.generator();

export const createElement = (id, type, x1, y1, x2, y2, options = {}) => {

  let { strokeColor, strokeWidth } = options

  if (strokeColor == "") {
    strokeColor = "white";
  }

  const height = y2 - y1;
  const width = x2 - x1;

  if (type === "freedraw") {
    strokeWidth *= 4;

    const { pressure } = options
    return { id, type, points: [{ x: x1, y: y1, pressure: pressure }], strokeColor, strokeWidth };
  } else if (type === "text") {
    return { id, type, x1, y1, x2, y2, width, height, text: "", font: "", strokeColor, strokeWidth };
  }

  const roughProperties = {
    strokeWidth: strokeWidth * 2,
    stroke: strokeColor,
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };
  let roughElement;

  if (type === "rectangle") {
    roughElement = generator.rectangle(x1, y1, width, height, roughProperties);
  } else if (type === "ellipse") {
    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, roughProperties);
  } else if (type === "line") {
    roughElement = generator.line(x1, y1, x2, y2, roughProperties);
  } else {
    throw new Error(`Type not found: ${type}`)
  }
  return { id, type, x1, y1, x2, y2, width, height, strokeColor, strokeWidth, roughElement };

}

// update Shape
export const updateElement = (element, options = {}) => {
  const { id, type, x1, y1, x2, y2, } = options
  const newOptions = {
    strokeColor: element.strokeColor,
    strokeWidth: element.strokeWidth,
  }
  let updatedElement;
  if (["line", "rectangle", "ellipse"].includes(type)) {
    updatedElement = createElement(id, type, x1, y1, x2, y2, newOptions);

  } else if (type == "freedraw") {
    updatedElement = element;
    const { points } = updatedElement;
    const { width, height } = getFreeDrawDimension(points);
    updatedElement = { ...updatedElement, width, height }
    updatedElement.points = [...points, { x: x2, y: y2, pressure: options.pressure }];
  } else if (type == "text") {

    updatedElement = createElement(id, type, x1, y1, x2, y2, newOptions);
    updatedElement.text = options.text;
    updatedElement.font = options.font;
  }
  return updatedElement;
}

export const drawElement = (rc, ctx, element) => {

  ctx.fillStyle = element.strokeColor;

  // ctx.fillStyle = element.strokeColor
  // ctx.fillStyle = "white"

  const { type, points } = element;

  // feature line curve in future
  if (type === "lineCurved") {
    const { x1, x2, y1, y2 } = element;
    const curve = [[x1, y1], [x1 + 500, y1], [x2, y2], [x2, y2]];
    const p1 = pointsOnBezierCurves(curve);
    rc.curve(p1, { roughness: 0 });
    return;
  }

  if (type === "line" || type === "rectangle" || type === "ellipse") {

    rc.draw(element.roughElement);

  } else if (type === "freedraw") {

    const options = getStroke(points, {
      simulatePressure: true,
      size: element.strokeWidth,
      smoothing: 0.5,
      thinning: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: {
        taper: 0,
        cap: true,
      },
      end: {
        taper: 0,
        cap: true,
      },
    })
    const stroke = getSvgPathFromStroke(options)

    ctx.fill(new Path2D(stroke))

  } else if (type === "text") {
    const { x1, y1, text } = element;
    ctx.textBaseline = "top";
    ctx.font = element.font;
    ctx.fillText(text, x1, y1);

    console.log(element)
    // ctx.fillRect(x1, y1, y1+element.height, 24);

  }
}
