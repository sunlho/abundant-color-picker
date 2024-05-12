import { defineConfig } from "vite"
import path from "path"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    vue(),
    dts({
      root: ".",
      insertTypesEntry: false,
      outDir: "dist/types",
      exclude: ["**/node_modules/**"],
      tsconfigPath: "tsconfig.lib.json",
      beforeWriteFile: (filePath, content) => {
        const origin = path.resolve(__dirname, "dist/types/packages")
        const replaceVal = path.resolve(__dirname, "dist/types")
        const newFilepath = filePath.replace(origin, replaceVal)
        return { filePath: newFilepath, content }
      },
    }),
  ],
  build: {
    lib: {
      entry: "packages/index.ts",
      name: "abundantColorPicker",
      fileName: (format) => `abundantColorPicker.${format}.js`,
    },
    rollupOptions: {
      external: ["tinycolor2", "vue", "abundant-color-picker", "element-plus"],
      output: {
        globals: {
          vue: "Vue",
          tinycolor2: "tinycolor",
          "element-plus": "ElementPlus",
        },
      },
    },
  },
})
