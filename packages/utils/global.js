// do not touch - from perfect freehand
const average = (a, b) => (a + b) / 2
export const getSvgPathFromStroke = (points, closed = true) => {
  const len = points.length

  if (len < 4) { return `` }

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} 
    Q${b[0].toFixed(2)}, ${b[1].toFixed(2)} ${average(b[0],
    c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)}` + ` `
  }

  if (closed) { result += 'Z' }

  return result
}


// for now get width height of perfect freehand tool
export const getFreeDrawDimension = (points) => {
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  const width = maxX - minX;
  const height = maxY - minY;
  return { width, height }
}