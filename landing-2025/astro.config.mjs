import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://io.gdg.com.bo",
  // Speaker photos are downloaded and optimized at build time, so visitors
  // never hit Firebase Storage.
  image: {
    domains: ["firebasestorage.googleapis.com"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
