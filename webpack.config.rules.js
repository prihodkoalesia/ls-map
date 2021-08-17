module.exports = function() {
    return [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.hbs/,
            use: 'handlebars-loader'
        },
        {
            test: /\.(jpe?g|png|gif|svg|)$/i,
            use: 'file-loader?name=images/[fullhash].[ext]'
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            use: 'file-loader?name=fonts/[name].[ext]'
        },
        {
            // test: /\.s[ac]ss$/i,
            // use: [
            //     // Creates `style` nodes from JS strings
            //     "style-loader",
            //     // Translates CSS into CommonJS
            //     "css-loader",
            //     // Compiles Sass to CSS
            //     "sass-loader",
            // ],
        },
    ];
};
