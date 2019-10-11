const path  = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:path.join(__dirname,'/src/main.js'),//入口文件
    output:{
        path:path.join(__dirname,'/dist'),//输出文件目录
        filename:'bundle.js'//输出文件名
    },
    plugins:[//插件
        new htmlWebpackPlugin({
            template:path.join(__dirname,'/src/index.html'),
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {test:/\.(png|gif|bmp|jpg)$/,use:'url-loader?limit=5000'},
            {test:/\.js$/,use:'babel-loader', exclude:/node_module/}
        ]
    }
};