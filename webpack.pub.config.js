const path  = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin  = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry:{//配置入口节点
        app:path.join(__dirname,'/src/main.js'),
        vendors:["jquery"]//把药抽离的第三方包的名称放到该数组中
    },//入口文件
    output:{
        path:path.join(__dirname,'/dist'),//输出文件目录
        filename:'bundle.js'//输出文件名
    },
    plugins:[//插件
        new htmlWebpackPlugin({
            template:path.join(__dirname,'/src/index.html'),
            filename: 'index.html',
            minify:{
                collapseWhitespace:true,//合并多余的空格
                removeComments:true,//移除注释
                removeAttributeQoute:true//移除属性上的双引号
            }
        }),
        new cleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendors',//指定要抽离的入口文件
            filename:'vendors.js',//将来在发布时，除了会有一个bundle.js还会多一个vendors.js文件,里面存放了所有第三方包
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{//配置压缩选项
                warnings:false//移除警告
            }
        }),
        new webpack.optimize.DedupePlugin({//设置为产品上线环境，进一步压缩js文件
            'process.env.NODE_ENV':'production'
        }),
        new ExtractTextPlugin("style.css"),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    module: {
        rules: [
            // {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.css$/,use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:'css-loader',
                })},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader'],},
            {test:/\.(png|gif|bmp|jpg)$/,use:'url-loader?limit=5000&name=[hash:8]-[name].[ext]'},
            {test:/\.js$/,use:'babel-loader', exclude:/node_module/}
        ]
    }
};