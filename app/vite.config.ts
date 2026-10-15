import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 백엔드 API 포트 (기본 8013). /api 요청을 백엔드로 프록시하여 CORS 없이 연동.
const API_PORT = process.env.VITE_API_PORT || '8013'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3017,
    host: true,
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
