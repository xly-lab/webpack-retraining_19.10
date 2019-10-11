# webpack 回顾+高级（复习学习笔记）

***按步骤一步一步来***
*第一次见谅*
### 第一步
- 创建如下文件格式：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019101114085648.png)
- npm init -y  生成该文件： 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191011140529564.png)
 - 编辑webpack.config.js文件：
 ```
 	const path  = require('path');
		module.exports = {
		    entry:path.join(__dirname,'/src/main.js'),//入口文件
		    output:{
		        path:path.join(__dirname,'/dist'),//输出文件目录
		        filename:'bundle.js'//输出文件名
		    }
		}
 ```
### 第二步 安装webpack
-	```
	npm i webpack --dev
	npm i webpack-dev-server html-webpack-plugin --dev
	```

### 第三步 修改webpack.config.js 添加下载的webpack等组件
-	修改如下：

```
const path  = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:path.join(__dirname,'/src/main.js'),//入口文件
    output:{
        path:path.join(__dirname,'/dist'),//输出文件目录
        filename:'bundle.js'//输出文件名
    },
    /*第四步*/plugins:[//插件
        new htmlWebpackPlugin({
            template:path.join(__dirname,'/src/index.html'),
            filename: 'index.html'
        })
    ]
}
```
-	第五步 修改 package.json 里"script"里更新为
```
    "dev": "webpack-dev-server --open --port 3000 --host"
```
- 以上语句为启动的节点 --open:自动打开浏览器 --port:指定端口号 --host:启动热更新

### 第六步  运行一下（应该有问题）
- ```npm run dev```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019101114352964.png)
- 果然 提示我们下载webpack-cli  下载后webpack工具正式启用运行

### 第七步 添加一些相关的loader
- 先下载这些loader
```
npm i style-loader css-loader sass-loader node-sass url-loader file-loader -S
```
### 第八步 配置 webpack.config.js里的module结点
- 配置如下：
 ```
module: {
        rules: [
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {test:/\.(png|gif|bmp|jpg)$/,use:'url-loader?limit=5000'},
            {test:/\.js$/,use:'babel-loader', exclude:/node_module/}
        ]
    }
```
### 第九步 在配置上步骤还要添加识别高级语法相关的loader
```
npm i babel-core babel-loader babel-plugin-transform-runtime babel-preset-env babel-preset-stage-0 -S
```
### 第十步  创建 .babelrc文件
```
{
  "presets": ["env","stage-0"],
  "plugins": ["transform-runtime"]
}
```

### 第十一步 发布之前：
- 命令行webpack执行，自动在dist文件下生成所有文件，由于生成的文件bundle.js太大，webpack.config.js为开发时的文件配置,复制其内容创建新的webpack.pub.config.js文件

-	在执行webpack时出现了问题，主要书该笔记也有半年多了，如今拿来复习一下也难免出错  网上找了下解决方案
-	1、 卸载旧的babel-core
npm un babel-core
- 2、 安装新的babel-core
npm i -D @babel/core
- 3、 卸载旧的babel-preset
npm un babel-preset-env
npm un babel-preset-stage-0
- 4、 安装新的babel-preset
npm i @babel/preset-react
npm i @babel/preset-env
npm i babel-preset-mobx
- 5、 卸载旧的babel-plugin
npm un babel-plugin-transform-runtime
- 6、 安装新的babel-plugin
npm install --save-dev @babel/plugin-proposal-object-rest-spread
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
- 7、修改.babelrc文件
```

```javascript
{
    "presets": ["@babel/preset-env", "@babel/preset-react", "mobx"],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-runtime"
    ]
}
```

#### ***！！webpack执行以后  成功***
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191011154634221.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019101115460633.png)
- __差距还是很大的__
### 第十二步 package.json
- "script"添加如下
```
    "pub": "webpack --config webpack.pub.config.js"
```

### 第十三步 删除无用文件
- 由于每次开发都会有新文件产生并且是一些旧文件无用了，所以要删除掉，安装此插件```npm i clean-webpack-plugin -S```
- 在webpack.pub.config.js文件中导入每次删除文件夹的插件，如下：
```
const cleanWebpackPlugin = require('clean-webpack-plugin');
new cleanWebpackPlugin(['dist']) //在plugins里new此句
```

### 第十四步  发布思路
- bundle.js中只存放自己的代码，第三方包的代码全部抽离到另外的js中
- 还没有结束，继续修改webpack.pub.config.js中的内容
```const webpack = require('webpack')```
- 在plugin中添加
```
	new webpack.optimize.CommonsChunkPlugin({
		name:'vendors',//指定要抽离的入口文件
        filename:'vendors.js',//将来在发布时，除了会有一个bundle.js还会多一个vendors.js文件,里面存放了所有第三方包
	})
```
- 需要修改 entry里的路径，修改如下：
```
	entry:{//配置入口节点
        app:path.join(__dirname,'/src/main.js'),
        vendors:["jquery"]//把药抽离的第三方包的名称放到该数组中
    },//入口文件
```
### 十五步 对js文件进行压缩
- 在webpack.pub.config.js文件里的plugin中添加
```
		new webpack.optimize.UglifyJsPlugin({
            compress:{//配置压缩选项
                warnings:false//移除警告
            }
        }),
        new webpack.optimize.DedupePlugin({//设置为产品上线环境，进一步压缩js文件
            'process.env.NODE_ENV':'production'
        })
```

### 十六步 压缩html
- 在plugin中HTMLwebpackPlugin对象中添加minify属性，如下：

```
	minify:{
        collapseWhitespace:true,//合并多余的空格
        removeComments:true,//移除注释
        removeAttributeQoute:true//移除属性上的双引号
    }
```

### 十七步 抽离样式表文件
- 下载此插件  ```npm i extract-text-webpack-plugin -S```
- 在webpack.pub.config.js中的配置与修改
```
	const ExtractTextPlugin = require('extract-text-webpack-plugin');
	//module下的rusle中关于css项修改
	{test:/\.css$/,use:['style-loader','css-loader']},==修改为==>
	
	{test:/\.css$/,use:ExtractTextPlugin.extract({
	                    fallback:'style-loader',use:'css-loader'
	                })},
```
- plugins 中 添加 new ExtractTextPlugin('css/style.css')
### 压缩抽离出来的css文件
- npm i optimize-css-assets-webpack-plugin -S
- const OptimizeCssAssetsWebpackPlugin  = require('optimize-css-assets-webpack-plugin');
- plugin中新增导入插件：new OptimizeCssAssetsWebpackPlugin()