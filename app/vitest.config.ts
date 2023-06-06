/// <reference types="vitest" />

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./**/*.{test,spec}.{js,ts,mjs,cjs,,mts,cts,jsx,tsx}'],
    exclude: [
      'test/electron',
      'node_modules',
      'build',
      'dist',
      'dist_electron',
      '.nuxt',
      '.output',
      '.yarn',
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './'),
      '@/store': path.resolve(__dirname, './store'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
})
