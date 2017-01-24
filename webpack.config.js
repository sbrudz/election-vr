const path = require("path");

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: {
        "2d-election-map": "./2d-election-map.js",
    },
    output: {
        filename: "[name].js",
        path: "./dist",
    },
    devtool: "inline-source-map",
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
        }],
    },
    devServer: {
        publicPath: "http://localhost:3033/dist/",
        contentBase: [path.join(__dirname, "www"), path.join(__dirname, "data")],
    },
};
