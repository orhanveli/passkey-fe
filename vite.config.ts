import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./certs/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "./certs/cert.pem")),
    },
    proxy: {
      "/auth": {
        target: "http://localhost:13390",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://localhost:13390",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
