import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCanvasStore = create(
  persist(
    (set) => ({
      elements: [],
      addElement: (el) =>
        set((state) => ({
          elements: [...state.elements, el],
        })),
      clearElements: () => set({ elements: [] }),
      setElements: (newElements) => set({ elements: newElements }),
    }),
    {
      name: "canvas-data", // key for localStorage
    }
  )
);
