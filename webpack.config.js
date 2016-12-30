var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: ['babel-polyfill', './cli/_cli.js'],
    output: {
        path: path.resolve(__dirname, './pub/dist/'),
        publicPath: 'dist/',
        filename: 'build.js'
    },
    module: {
        loaders: [{
            test: /\.(vue|html)$/,
            loader: 'vue-loader',
            include: /cli/,
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: /cli/,
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            include: /cli/,
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader',
            include: /cli/,
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
            loader: 'file-loader',
            query: {
                name: '[name].[ext]?[hash]'
            },
            include: /cli/,
        }]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
    },
    devtool: '#eval-source-map',
    performance: {
        hints: false
    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
    new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
  ])
}
