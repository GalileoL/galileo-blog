import { merge } from "webpack-merge";
import baseConfig from "./webpack.base.config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { watch } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 5174, // in case conflict with Vite dev server
    hot: true,
    historyApiFallback: true, // for SPA routing
    static: {
      directory: path.resolve(__dirname, "public"),
      watch: true, // watch for changes in public directory
    },
    // proxy can be used to handle cross-origin requests
    proxy: [],
  },
});
