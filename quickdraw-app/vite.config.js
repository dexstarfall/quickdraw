import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@actions": path.resolve(__dirname, "./src/actions"),
    }
  },
})
