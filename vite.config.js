import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
  plugins: [
    {
      name: 'inline-preload-hint',
      transformIndexHtml: {
        order: 'pre',
        handler() {
          const code = fs.readFileSync('./src/preload.js', 'utf-8')
          return [{ tag: 'script', children: code, injectTo: 'head-prepend' }]
        },
      },
    },
    {
      name: 'copy-meal-data',
      closeBundle() {
        fs.cpSync('meal', 'dist/meal', { recursive: true })
      },
    },
  ],
})
