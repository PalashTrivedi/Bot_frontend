const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// const devMode = process.env.NODE_ENV !== 'production';
const devMode = false;

module.exports = {
    mode: "production",
    entry: {
        "bundle-vendor": [
            // "./assets/js/jquery.min.js",
            "./assets/js/bootstrap.min.js",
            // "./assets/js/mustache.min.js",
            "./assets/js/popper.min.js",
            "./assets/js/tether.min.js",
            "./assets/js/bootstrap-material-design.min.js",
            "./assets/js/recorder.js",
            // "./assets/js/fetch.min.js",
            "./assets/js/bluebird.min.js",
            // "./assets/js/ie11CustomProperties.min.js",
            "./assets/js/sentry.min.js",
            // css
            "./assets/css/bootstrap.min.css",
            "./assets/css/bootstrap-material-design.min.css",
        ],
        "bundle-app": ["./assets/css/style.css"],
    },
    output: {
        filename: "[name].[contentHash].js",
        path: path.resolve(__dirname, "dist"),
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? "[name].css" : "[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
        }),
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode,
                        },
                    },
                    "css-loader",
                ],
            },
        ],
    },
};
