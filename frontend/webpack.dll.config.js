// this is for dll
// when you run `npm run build:webpack:dll`, it will create a dll file for vendor libraries
// remenber steps:
// 1. in webpack.prod.config.js, add `new webpack.DllReferencePlugin` to reference the dll file by `path.resolve(__dirname, "dist", "vendor-manifest.json")`
// 2. in template html file, add <script src="/vendor.dll.js"></script> to load the dll file
// 3. run `npm run build:webpack:dll` to generate the dll file
// 4. run `npm run build:webpack:prod` to generate the production bundle
import webpack from "webpack";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: {
    vendor: ["react"],
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "dist"),
    library: "[name]_lib",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_lib",
      context: __dirname,
      path: path.resolve(__dirname, "dist", "[name]-manifest.json"),
    }),
  ],
};
