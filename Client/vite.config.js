import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alais: {
      "@src": "/src",
      "@pages": "/src/pages",
      "@component": "/src/component",
      "@config": "/src/config",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@layouts": "/src/layouts",
      "@assets": "/src/assets",
    },
  },
});
