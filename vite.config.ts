import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      '@pages': path.resolve(__dirname, './src/components/pages/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@customTypes': path.resolve(__dirname, './src/customTypes/'),
      '@queries': path.resolve(__dirname, './src/utils/queries/'),
      '@hooks': path.resolve(__dirname, './src/utils/hooks/'),
      '@contexts': path.resolve(__dirname, './src/utils/contexts/'),
      '@functions': path.resolve(__dirname, './src/utility/functions/'),
      '@api': path.resolve(__dirname, './src/api/'),
      '@hocs': path.resolve(__dirname, './src/components/hocs/'),
      '@constants': path.resolve(__dirname, './src/utils/constants/'),
      '@helpers': path.resolve(__dirname, './src/utils/helpers/'),
      '@src': path.resolve(__dirname, './src/'),
    },
    mainFields: ['module'],
  },
});
