const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports={
    entry:{
        index:"./src/index.js",
        decode:"./src/decode.ts",
        math: './src/math.js',
        drawing: './src/drawing/index.ts'
    },
    devtool:"source-map",
    mode:"development",
    output:{
        path:path.join(__dirname,"dist"),
        filename:"[name].js",
        publicPath: ''
    },
    resolve: {
      modules: [
        'node_modules',
        process.cwd() + '/node_modules'
      ],
      alias: {
        '@': process.cwd() + '/src',
        common: process.cwd() + '/src/common',
        asset: process.cwd() + '/src/drawing/assets',
      },
      extensions: ['.js', '.ts', '.json', '.less', '.css']
    }, 
    module:{
        rules: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              use: "babel-loader"
            },
            {
                test: /.(png|jpg|gif|jpeg|cur|ico)$/,
                use: [
                  {
                    loader: "file-loader",
                    options:{
                      esModule:false
                      }
                  }
                ]
              },
              {
                test: /.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                  {
                    loader: "file-loader",
                    options:{
                      esModule:false
                      }
                  }
                ]
              },
              {
                test:/\.ts$/,
                exclude: /node_modules/,
                use:['ts-loader']
              },
              {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
              },
              {
                test: /\.less$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'less-loader'
                ]
              },
              {
                test:/\.(html|htm)$/i,
                 use:'html-withimg-loader', // 解析 html中的图片资源
             },
          ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `./src/index.html`),
          filename: "index.html",
          chunks: ["index"],
          inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, `./src/math.html`),
            filename: "math.html",
            chunks: ["math"],
            inject: true
          }),
          new HtmlWebpackPlugin({
            template: path.join(__dirname, `./src/decode.html`),
            filename: "decode.html",
            chunks: ["decode"],
            inject: true
          }),
          new HtmlWebpackPlugin({
            template: path.join(__dirname, `./src/drawing/index.html`),
            filename: "drawing.html",
            chunks: ["drawing"],
            inject: true
          }),
          new HtmlWebpackPlugin({
            template: path.join(__dirname, `./src/regex101.html`),
            filename: "regex101.html",
            chunks: ["regex101"],
            inject: true
          }),
        new MiniCssExtractPlugin({
          filename: "[name].css"
        }),
        new CleanWebpackPlugin()
     ],
    devServer:{
        hot:true
    }
}