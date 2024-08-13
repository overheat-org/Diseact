const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

/**
 * @type {import('webpack').Configuration}
 */
const config = {
    entry: {
        "lib/index": "./src/lib/index.js",
        "hooks/index": {
            import: "./src/hooks/index.js"
        },
        "jsx-runtime/index": {
            import: "./src/jsx-runtime/index.js"
        }
    },
    output: {
        filename: "[name].js",
        path: __dirname,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: "/src/",
                use: {
                    loader: 'node-loader'
                },
            }
        ]
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/hooks/*.d.ts', to: 'hooks/[name][ext]' },
                { from: 'src/jsx-runtime/*.d.ts', to: 'jsx-runtime/[name][ext]' },
                { from: 'src/lib/*.d.ts', to: 'lib/[name][ext]' },
            ],
        }),
    ],
    target: "node",
}

module.exports = config;