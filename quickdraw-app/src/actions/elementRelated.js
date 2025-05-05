import rough from 'roughjs';
import { getFreeDrawDimension } from '@utils/global';


let generator = rough.generator();

export const createElement = (id, type, x1, y1, x2, y2) => {
  const roughProperties = {
    strokeWidth: 3,
    stroke: 'lightcoral',
    roughness: 0,
    bowing: 3,
    // disableMultiStroke: true
  };
  let roughElement;
  const height = y2 - y1;
  const width = x2 - x1;

  if (type === "line") {

    roughElement = generator.line(x1, y1, x2, y2, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "rectangle") {

    roughElement = generator.rectangle(x1, y1, width, height, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "ellipse") {

    const centerX = (x2 + x1) / 2;
    const centerY = (y2 + y1) / 2;
    roughElement = generator.ellipse(centerX, centerY, width, height, roughProperties);
    return { id, type, x1, y1, x2, y2, width, height, roughElement };

  } else if (type === "freedraw") {

    return { id, type, points: [{ x: x1, y: y1 }] };

  } else if (type === "text") {

    return { id, type, x1, y1, x2, y2, width, height, text: "" };

  }
  else {
    throw new Error(`Type not found: ${type}`)
  }
}

// update Shape
export const updateElement = (element, content, options = {}) => {
  const { id, type, x1, y1, x2, y2, } = content
  let updatedElement;
  if (["line", "rectangle", "ellipse"].includes(type)) {
  updatedElement = createElement(id, type, x1, y1, x2, y2);

  } else if (type == "freedraw") {
    updatedElement = element;
    const { points } = updatedElement;
    const { width, height } = getFreeDrawDimension(points);
    updatedElement = { ...updatedElement, width, height }
    updatedElement.points = [...points, { x: x2, y: y2 }];
  } else if (type == "text") {
    updatedElement = createElement(id, type, x1, y1, x2, y2);
    updatedElement.text = options.text;
  }
  return updatedElement;
}