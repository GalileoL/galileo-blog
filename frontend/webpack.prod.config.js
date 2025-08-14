import { merge } from "webpack-merge";
import baseConfig from "./webpack.base.config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(baseConfig, {
  mode: "production",
  plugins: [
    new CssMinimizerPlugin({}),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: true,
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.resolve(__dirname, "dist", "vendor-manifest.json"),
    // }),
    // new webpack.EnvironmentPlugin({
    //   IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    //   IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    //   IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    // }),
  ],
});
