export const exportCanvasToImage = (canvasRef, filename = "drawing.png") => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

export const saveCanvasToFile = () => {
  const data = localStorage.getItem("quickdraw-canvas");
  if (!data) return;
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quickdraw_Canvas.json";
  link.click();
};
