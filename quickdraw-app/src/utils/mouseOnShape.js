import { distance, nearPoint } from './math'

export const onCorner = (mx, my, x1, y1, x2, y2) => {
  const topLeft = nearPoint(mx, my, x1, y1, "tl");
  const topRight = nearPoint(mx, my, x2, y1, "tr");
  const bottomLeft = nearPoint(mx, my, x1, y2, "bl");
  const bottomRight = nearPoint(mx, my, x2, y2, "br");

  return topLeft || topRight || bottomLeft || bottomRight;
}

// check -> 'click' on 'line, rectangle, ellipse '
export const onLine = (mx, my, x1, y1, x2, y2, threshold = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x: mx, y: my };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < threshold ? "onShape" : null;
}

export const onRectangle = (mx, my, x1, y1, x2, y2, threshold = 5) => {
  const nearLeft = Math.abs(mx - x1) <= threshold && my >= y1 && my <= y2;
  const nearRight = Math.abs(mx - x2) <= threshold && my >= y1 && my <= y2;
  const nearTop = Math.abs(my - y1) <= threshold && mx >= x1 && mx <= x2;
  const nearBottom = Math.abs(my - y2) <= threshold && mx >= x1 && mx <= x2;

  return nearLeft || nearRight || nearTop || nearBottom ? "onShape" : null;
}

export const onEllipse = (mx, my, x1, y1, x2, y2, threshold = 0.1) => {
  const width = Math.abs(x2 - x1) / 2;
  const height = Math.abs(y2 - y1) / 2;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  // Normalize the mouse position to the ellipse center
  const dx = (mx - centerX) / width;
  const dy = (my - centerY) / height;
  // The ellipse equation: dx² + dy² = 1 
  const distance = Math.abs((dx * dx + dy * dy) - 1);
  return distance < threshold ? "onShape" : null;
};
