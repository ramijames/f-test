import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'sequelize',
        'sqlite3',
        'rss-parser',
      ]
    }
  }
});