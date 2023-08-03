const path = require('path');
const TerserWebpackPlugin = require("terser-webpack-plugin");

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
    output: {
        filename: 'StyleViewer.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin()],
    },
};