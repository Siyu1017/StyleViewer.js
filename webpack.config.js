const path = require('path');
module.exports = {
    entry: './src/StyleViewer.js',
    output: {
        filename: 'StyleViewer.min.js', 
        path: path.resolve(__dirname, 'dist'),
    }
};