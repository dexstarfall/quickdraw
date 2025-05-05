import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const functionalityStore = (set) => ({
  // some var

  // some function
})

const useFunctionalityStore = create(
  devtools(
    functionalityStore,
    { name: "functionalityStore" }
  )
)

export { useFunctionalityStore }

