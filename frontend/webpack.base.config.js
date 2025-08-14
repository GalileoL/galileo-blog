import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { fileURLToPath } from "node:url";
import path from "node:path";
import webpack from "webpack";
import { rules } from "eslint-plugin-react-refresh";
import test from "node:test";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import fs from "node:fs";
import dotenv from "dotenv";
import { argv } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// handle import.meta.env to be compatible with webpack
const MODE = argv.mode || process.env.NODE_ENV || "production";
const envPath = `.env.${MODE}`;
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// only deliver prefix with VITE_, same as Vite
const PUBLIC_PREFIX = "VITE_";
const pickPublic = (src) =>
  Object.fromEntries(
    Object.entries(src).filter(([key]) => key.startsWith(PUBLIC_PREFIX))
  );
const publicEnv = pickPublic(process.env);

let pluginArr = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "index.html"),
    filename: "index.html",
  }),
  new webpack.DefinePlugin({
    "import.meta.env": JSON.stringify(publicEnv),
  }),
];
function getPlugins() {
  if (process.env.NODE_ENV === "production") {
    pluginArr.push(
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[contenthash:8].css",
        chunkFilename: "assets/css/[name].[contenthash:8].css",
      })
    );
  }
  return pluginArr;
}
getPlugins();

export default {
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "assets/[name].[contenthash:8].js",
    chunkFilename: "assets/[name].[contenthash:8].js",
    // assetModuleFilename is for static assets like images, fonts, etc, it replace file-loader and url-loader
    assetModuleFilename: "assets/[name].[hash][ext][query]",
    // publicPath is important for SPA routing
    publicPath: "/",
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // public cache groups
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: "vendor",
        //   chunks: "all",
        //   priority: -10,
        //   minChunks: 1,
        //   filename: "assets/js/vendor.[contenthash:8].js",
        // },
        npm: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const m =
              module.context &&
              module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const pkg = m && m[1] ? m[1].replace("@", "") : "vendor";
            return `assets/js/npm.${pkg}`;
          },
          chunks: "all",
          priority: 20,
        },
        //   // common cache groups
        common: {
          filename: "assets/js/[name].[contenthash:8].js",
          minChunks: 2,
          chunks: "all",
          minSize: 0,
        },
      },
    },
    runtimeChunk: "single",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      // babel loader config is in .babelrc, it is for transpiling modern JavaScript and React code
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      // css and tailwindcss
      {
        test: /\.css$/,
        // when production, use mini css loader, when development, use style loader
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [tailwindcss(), autoprefixer()],
              },
            },
          },
        ],
      },

      //   static assets, if it is less than 4kb, it will be inlined as base64, otherwise it will be copied to output folder
      {
        test: /\.(png|jpe?g|gif|svg|ico|webp|bmp|woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac|zip|tar|gz|rar|7z|exe|dll|deb|rpm|apk|jpg|jpeg|png|gif|svg|ico|webp|bmp|woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac|zip|tar|gz|rar|7z|exe|dll|deb|rpm|apk)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
        generator: {
          filename: "assets/[name].[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    // eslint config is in eslint.config.js, it is for linting JavaScript and React code

    ...pluginArr,
  ],
};
