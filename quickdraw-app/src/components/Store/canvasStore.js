import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const canvasStore = (set) => ({
  // selection, line, rectangle, ellipse
  tool: "selection",
  // action -> none, drawing, moving,
  action: "none",
  selectionElement: null,
  // canvas scale
  scale: 1,
  scaleOffset: { x: 0, y: 0 },
  panOffset: { x: 0, y: 0 },
  startPanPosition: { x: 0, y: 0 },

  // setSomething function
  setTool: (tool) => set({ tool }),
  setAction: (action) => set({ action }),
  setScale: (scale) => set({ scale }),
  setSelectionElement: (selectionElement) => set({ selectionElement }),
  setScaleOffset: (updater) => set((state) => ({
    scaleOffset:
      typeof updater === "function"
        ? updater(state.scaleOffset)
        : updater,
  })),
  setPanOffset: (updater) => set((state) => ({
    panOffset:
      typeof updater === "function"
        ? updater(state.panOffset)
        : updater,
  })),
  setStartPanPosition: (updater) => set((state) => ({
    startPanPosition:
      typeof updater === "function"
        ? updater(state.startPanPosition)
        : updater,
  })),

})

const useCanvasStore = create(
  devtools(
    persist(
      canvasStore,
      {
        name: "quickdraw-canvas",
        partialize: (state) => ({
          tool: state.tool,
          scale: state.scale,
        }),
      }
    ),
    { name: "quickdrawCanvas" }
  )
)

export { useCanvasStore }

