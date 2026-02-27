import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'motion-vendor'
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor'
            }
            if (id.includes('react-icons')) {
              return 'icons-vendor'
            }
            if (id.includes('axios')) {
              return 'network-vendor'
            }
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
