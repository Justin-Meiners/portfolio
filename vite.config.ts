import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  build: {
    // 98.css breaks the default lightningcss minifier, so skip CSS minify
    cssMinify: false,
  },
})
