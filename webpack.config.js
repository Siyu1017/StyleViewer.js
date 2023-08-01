const path = require('path');
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
    }
};