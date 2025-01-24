import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

const beHost = "http://localhost:13390";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3022,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./certs/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "./certs/cert.pem")),
    },
    proxy: {
      "/api": {
        target: beHost,
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace("api/", ""),
      },
    },
  },
});
