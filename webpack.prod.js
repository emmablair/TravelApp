const path = require("path")
const webpack = require("webpack")
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// for Service Workers
const WorkboxPlugin = require('workbox-webpack-plugin');

// nedded to load bg image from index.scss so MiniCssPlugin works also
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
    devtool: 'source-map',
    stats: {
        orphanModules: true
      },
    entry: './src/client/index.js',
    output: {
        libraryTarget: 'var',
        library: 'Client',
        /**
         * With zero configuration,
         *   clean-webpack-plugin will remove files inside the directory below
         */
        publicPath: ASSET_PATH,
        path: path.resolve(process.cwd(), 'dist'),
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new MiniCssExtractPlugin({ filename: "[name].css" }),
        // This makes it possible for us to safely use env vars on our code
        // nedded to load bg image from index.scss
        new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
        new WorkboxPlugin.GenerateSW()
    ]
}