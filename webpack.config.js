const path = require('path');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');

const banner = 
`Siyu1017 (c) ${new Date().getFullYear()}
All rights reserved.
StyleViewer.js v${pkg.version}`;

module.exports = {
    entry: './src/StyleViewer.js',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
        ]
    },
    devtool: "source-map",
    output: {
        filename: 'StyleViewer.min.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false
            })
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: banner
        })
    ]
};