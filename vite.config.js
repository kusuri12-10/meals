import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
  plugins: [
    {
      name: 'copy-meal-data',
      closeBundle() {
        fs.cpSync('meal', 'dist/meal', { recursive: true })
      },
    },
  ],
})
