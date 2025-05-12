import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


const optionsStore = (set) => ({
    fillColor: "transparent",
    strokeColor: "white",
    strokeWidth: 2,
    fontSize: 20,
    roughness: 2,
    setFillColor: (color) => set({ fillColor: color }),
    setStrokeColor: (color) => set({ strokeColor: color }),
    setStrokeWidth: (width) => set({ strokeWidth: width }),
    setFontSize: (size) => set({ fontSize: size }),
    setRoughness: (rough) => set({ roughness: rough })
})

const canvasStore = (set) => ({
    // selection, line, rectangle, ellipse
    // action -> none, drawing, moving,
    // canvas scale
    tool: "selection",
    action: "none",
    selectionElement: null,
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
    elements: [],
    setElements: (updater) => set((state) => ({
        elements:
            typeof updater === "function"
                ? updater(state.elements)
                : updater,
    })),
})

const historyStore = (set, get) => ({
    index: 0,
    history: [[]], // initialState = []

    setHistory: (action, overwrite = false) => {
        const { history, index } = get();
        const newState = typeof action === 'function' ? action(history[index]) : action;

        if (overwrite) {
            const newHistory = history.map((h, i) => i === index ? newState : h);
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
            useCanvasStore.getState().setElements(get().getCurrentState());
        }
    },

    redo: () => {
        const { index, history } = get();
        if (index < history.length - 1) {
            set({ index: index + 1 });
            useCanvasStore.getState().setElements(get().getCurrentState());
        }
    },

    deleteAllElements: () => {
        const { history, index } = get();
        const emptyState = [];
        // Pushing new empty state as a new entry in history
        const newHistory = [...history.slice(0, index + 1), emptyState];
        const newIndex = index + 1;
        set({ history: newHistory, index: newIndex });
        useCanvasStore.getState().setElements(emptyState);
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
                    elements: state.elements,
                    panOffset: state.panOffset,
                }),
                getStorage: () => localStorage,
            }
        ),
        { name: "quickdrawCanvas" }
    )
)

const useOptionsStore = create(
    devtools(
        persist(
            optionsStore,
            {
                name: "options",
                partialize: (state) => ({
                    fillColor: state.fillColor,
                    strokeColor: state.strokeColor,
                    strokeWidth: state.strokeWidth,
                    fontSize: state.fontSize,
                    roughness: state.roughness,
                }),
                getStorage: () => localStorage,
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

export { useOptionsStore, useCanvasStore, useHistoryStore }

