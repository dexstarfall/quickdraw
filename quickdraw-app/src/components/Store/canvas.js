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

const historyStore = (set, get) => ({
  index: 0,
  history: [[]], // initialState = []

  setState: (action, overwrite = false) => {
    const { history, index } = get();
    const newState = typeof action === 'function' ? action(history[index]) : action;

    if (overwrite) {
      const newHistory = history.map((elm, i) => i === index ? newState : elm);
      set({ history: newHistory });
    } else {
      const newHistory = [...history.slice(0, index + 1), newState];
      set({ history: newHistory, index: index + 1, });
    }
  },

  undo: () => {
    const { index } = get();
    if (index > 0) {
      set({ index: index - 1 });
    }
  },

  redo: () => {
    const { index, history } = get();
    if (index < history.length - 1) {
      set({ index: index + 1 });
    }
  },

  // Getter for current state for history
  getCurrentState: () => {
    const { history, index } = get();
    return history[index];
  },
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

const useHistoryStore = create(
  devtools(historyStore,
    { name: "quickdrawHistory" }
  )
)

export { useCanvasStore, useHistoryStore }

