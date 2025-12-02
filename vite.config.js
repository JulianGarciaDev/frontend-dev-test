import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__test__/',
        '**/*.test.{js,jsx}',
        '**/*.integration.test.{js,jsx}',
        'src/main.jsx',
        'src/App.jsx',
        '**/*.css',
      ],
      include: ['src/**/*.{js,jsx}'],
    },
  },
})
