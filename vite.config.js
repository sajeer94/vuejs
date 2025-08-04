import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/users/api': {
        target: 'http://192.168.0.124:9090',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/users\/api/, '/users/api')
      }
    }
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: fileURLToPath(new URL('./src/quasar-variables.sass', import.meta.url))
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
