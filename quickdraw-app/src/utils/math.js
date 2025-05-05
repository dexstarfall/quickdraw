// distance b/w 2 points
export const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

// check -> 'click' on 'corner point' 
export const nearPoint = (mx, my, x, y, name) => {
  return Math.abs(mx - x) < 5 && Math.abs(my - y) < 5 ? name : null;
}
