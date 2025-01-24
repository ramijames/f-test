import { rmSync } from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import renderer from 'vite-plugin-electron-renderer';

rmSync('dist-electron', { recursive: true, force: true });

export default defineConfig({
  plugins: [
    vue(),
    renderer({
      nodeIntegration: true,
    }),
  ],
  server: process.env.VSCODE_DEBUG ? (() => {
    const url = new URL(process.env.VITE_DEV_SERVER_URL);
    return {
      host: url.hostname,
      port: +url.port,
    };
  })() : undefined,
  clearScreen: false,
});