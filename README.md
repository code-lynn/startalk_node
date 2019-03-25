## Startalk Web
### 简介
- Startalk Web是网页版聊天工具，按功能作用划分为三个项目，分别是startalk_node、startalk_web、startalk_sdk。
- startalk_sdk：IM SDK通信组件库
    - 通过strophe+websocket生成js文件，实现基本的通信聊天，通过调用组件库的相关方法实现不同场景下的聊天需求。
    - 适用于已存在web端通信页面的项目，仅需调用SDK即可实现基础通信服务，同时SDK后续迭代会同时适用web、移动端、小程序等，实现组件库统一。
- startalk_web：web聊天界面
    - 通过webpack+react生成web聊天界面所需要的js和css文件，后续迭代可包含业务定制及个性化配置，再引入sdk组件库，即可实现不同业务下的通信需求。
    - 适用于当前有web服务但没有聊天界面的项目，只需在HTML模板中嵌入js、css，sdk即可。
- startalk_node：web服务
    - 通过node+express实现web基础服务，通过路由配置加载不同的HTML模板，进而实现一个服务对应多端需求的通信界面显示。
    - 适用于零启动的项目，在服务器部署node项目加载相应的HTML模板，再引入web界面的js、css和sdk.js组件库,实现完整的聊天页面。
- 推荐部署环境：node 8.6.0    npm 5.3.0，
    - node@>=7.6.0
    - npm@>=3.0.0
    - pm2@>=2.0.0(全局安装)
- 服务器直接部署策略和本地上传服务器部署策略二者选其一即可
- 建议先从github上fork到自己的git仓库，顺便点击下Star,然后down到本地去修改配置，查看无误后提交到自己的仓库，以便查看修改记录，再参考服务器直接部署策略进行部署。
- 您的

## 服务器直接部署策略

### 下载代码到服务器
- 先ssh登录服务器，进入指定文件夹下载源码

```
    cd /startalk/download
    git clone [startalk_web_sdk git地址]
    git clone [startalk_web git地址]
    git clone [startalk_node git地址]
    cp startalk_web_sdk /startalk/startalk_web_sdk
    cp startalk_web /startalk/startalk_web
    cp startalk_node /startalk/startalk_node
```
### IM SDK项目

#### 一、安装依赖
```
    cd /startalk/startalk_web_sdk
    npm install 
```
#### 二、修改配置
- 修改startalk_sdk项目目录下的 sdk_config.js 文件
```
    vim /startalk/startalk_web_sdk/sdk_config.js
    :wq 保存退出
```
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看返回的json数据，找到相同key对应的value填入即可
- sdk_config.js
    - pub_key_fullkey：公钥
    - "domain":"qtalk.test.org",//公司域名
    - "pub_key_fullkey":"",//公钥
    - "fileurl":"",//静态文件
    - "javaurl":"",//后台接口 package接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
- pub_key_fullkey获取方法
    - 将后台部署完成后生成的导航地址放到浏览器中访问，会返回json数据，读取baseaddess/javaurl的值
    - 将导航里的javaUrl + /qtapi/nck/rsa/get_public_key.do，粘贴到浏览器访问
    - 将返回数据data/pub_key_fullkey的值粘贴到配置文件即可

#### 三、prod打包
```
    npm run build:prod
    cp -rf startalk/startalk_web_sdk/prd /startalk/startalk_node/public
```
- 执行build操作后，会在prd目录下生成 qtalk_web_sdk@version.js 文件，拷贝到node项目的public文件夹下，用于html引入。

### startalk_web项目

#### 一、安装依赖
```
    cd /startalk/startalk_web
    npm install 
```

#### 二、修改配置
- 修改startalk_web项目目录下的 web_config.js 文件
```
    vim /startalk/startalk_web/web_config.js
    :wq 保存退出
```
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看返回的json数据，找到相同key对应的value填入即可
- config
    - host:ws服务器及端口
    - maType：平台类型 web端为6
    - "domain":"qtalk.test.org",//公司域名
    - "fileurl":"",//静态文件
    - "javaurl":"",//后台接口 package接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
    - "emails":"darlyn"//email后缀

#### 三、prod打包
```
    npm run build:prod
    cp -rf startalk/startalk_web/prd/js /startalk/startalk_node/public
    cp -rf startalk/startalk_web/prd/css /startalk/startalk_node/public
```
- 执行build操作后，会分别在prd/js和prd/css目录下生成 index@version.js 和index@version.css文件，拷贝到node项目的public文件夹下，用于html引入。

### startalk_node项目

#### 一、安装依赖
```
    cd /startalk/startalk_node
    npm install
```

#### 二、查看 js、css、sdk文件导入
```
    cd /startalk/startalk_node/public
    ls
```
- 将 startalk_sdk项目中prd/qtalk_web_sdk@version.js文件复制到node项目public文件夹下。
- 将 startalk_web项目中prd/js/index@version.js文件和prd/css/index@version.css复制到node项目public文件夹下。
- ls 查看是否拷贝成功

#### 三、修改配置
- 修改startalk_web项目目录下的 node_config.js 文件
- config
    - port：服务端口
     - web：
        - title:项目标题
        - appId:web项目入口ID
        - stycss:web项目 css路径--public中的css文件名
        - scrcss:web项目 css路径--public中的css文件名（没有第二个css可不填）
        - sdkjs: sdk路径--public中的sdk文件名
        - scrjs: web项目 cjs路径--public中的js文件名
        - ...

#### 四、服务器环境安装
- cd /startalk/download/
- 安装node：
    - 方法一：sudo yum install nodejs
    - node -v 查看版本是否满足，删除yum安装的node，采用方法二安装
    >yum安装注意node版本，
    - 方法二：
        - 下载nodejs：
        ```
        wget https://npm.taobao.org/mirrors/node/v8.6.0/node-v8.6.0-linux-x64.tar.xz
        ```
        - 解压：
        ```
        tar -xvf  node-v8.6.0-linux-x64.tar.xz
        ```
        - 进入解压目录下的 bin 目录，执行 ls 命令，检查是否安装成功
        ```
        cd  node-v8.6.0-linux-x64/bin && ls
        ```
        - 测试
        ```
        ./node -v
        ```
        - root用户：node环境配置
        ```
        vi /etc/profile
        ```
        - 在最下面加入
        ```
        #set for nodejs 
　　　　　export NODE_HOME=/usr/local/node  
　　　　　export PATH=$NODE_HOME/bin:$PATH 
        ```
        - 保存并退出，使配置文件生效
        ```
        :wq
        source /etc/profile
        ```
        - 这样就可以使用node命令了，
        - 若还不行，则尝试使用软连接

- 安装pm2：
```
sudo npm install -g pm2
```

- 若安装完成pm2后，仍无法使用此命令，可尝试引入软连接
    - pm2 软连接 ：
        - ll 查看目录下引入的软连接
        - 如：sudo ln ./pm2 /usr/local/bin/pm2 引入软连接

#### 五、服务器代码上传与项目启动
```
cd /startalk/startalk_node
sudo pm2 start ./bin/start --watch
sudo pm2 list 
sudo pm2 show [id]
```
- pm2启动项目执行list命令查看id，再执行show命令查看启动状态
- 项目启动成功后就可以在浏览器输入服务器名+端口访问了

## 本地上传服务器部署策略

### IM SDK项目

#### 一、将项目克隆到本地

- 克隆项目：git clone [git地址]
- 安装依赖：npm install

#### 二、修改配置

- 修改startalk_sdk项目目录下的 sdk_config.js 文件
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看返回的json数据，找到相同key对应的value填入即可
- sdk_config.js
    - pub_key_fullkey：公钥
    - "domain":"qtalk.test.org",//公司域名
    - "pub_key_fullkey":"",//公钥
    - "fileurl":"",//静态文件
    - "javaurl":"",//后台接口 package接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
- pub_key_fullkey获取方法
    - 将后台部署完成后生成的导航地址放到浏览器中访问，会返回json数据，读取baseaddess/javaurl的值
    - 将导航里的javaUrl + qtapi/nck/rsa/get_public_key.do，粘贴到浏览器访问
    - 将返回数据data/pub_key_fullkey的值粘贴到配置文件即可

#### 三、本地测试访问

- 本地启动： npm start  
- 本地访问测试：http://127.0.0.1:5001/qtalk_web_sdk@local.js
- 若本地调试接口会涉及跨域，可通过配置ngx+host解决

#### 四、本地prod打包

- prod打包：npm run build:prod
>执行build操作后，会在prd目录下生成 qtalk_web_sdk@version.js 文件，用于node项目html引入

### startalk_web项目

#### 一、将项目克隆到本地

- 克隆项目：git clone [git地址]
- 安装依赖：npm install

#### 二、修改配置
- 修改startalk_web项目目录下的 web_config.js 文件
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看返回的json数据，找到相同key对应的value填入即可
- config
    - host:ws服务器及端口
    - maType：平台类型 web端为6
    - "domain":"qtalk.test.org",//公司域名
    - "fileurl":"",//静态文件
    - "javaurl":"",//后台接口 package接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
    - "emails":"darlyn"//email后缀

#### 三、本地测试访问
- 本地启动： npm start  
- 本地访问测试：http://127.0.0.1:5002
- 若本地调试接口会涉及跨域，可通过配置ngx+host解决

#### 四、本地prod打包
- prod打包：npm run build:prod
>执行build操作后，会分别在prd/js和prd/css目录下生成 index@version.js 和index@version.css文件，用于node项目html引入

### startalk_node项目

#### 一、将项目克隆到本地
- 克隆项目：git clone [git地址]
- 安装依赖：npm install

#### 二、js、css、sdk文件导入
- 将 startalk_sdk项目中prd/qtalk_web_sdk@version.js文件复制到node项目public文件夹下。
- 将 startalk_web项目中prd/js/index@version.js文件和prd/css/index@version.css复制到node项目public文件夹下。

#### 三、修改配置
- 修改startalk_web项目目录下的 node_config.js 文件
- config
    - port：服务端口
     - web：
        - title:项目标题
        - appId:web项目入口ID
        - stycss:web项目 css路径
        - scrcss:web项目 css路径
        - sdkjs: sdk路径
        - scrjs: web项目 cjs路径
        - ...

#### 四、本地测试访问
- 本地启动： npm start  
- 本地访问测试：http://127.0.0.1:5000
- 若本地调试接口会涉及跨域，可通过配置ngx+host解决

#### 五、服务器环境安装
- ssh@darlyn 登录服务器 输入密码
- cd /startalk/download/
- 安装node：
    - 方法一：sudo yum install nodejs
    - node -v 查看版本是否满足，删除yum安装的node，采用方法二安装
    >yum安装注意node版本，
    - 方法二：
        - 下载nodejs：
        ```
        wget https://npm.taobao.org/mirrors/node/v8.6.0/node-v8.6.0-linux-x64.tar.xz
        ```
        - 解压：
        ```
        tar -xvf  node-v8.6.0-linux-x64.tar.xz
        ```
        - 进入解压目录下的 bin 目录，执行 ls 命令，检查是否安装成功
        ```
        cd  node-v8.6.0-linux-x64/bin && ls
        ```
        - 测试
        ```
        ./node -v
        ```
        - root用户：node环境配置
        ```
        vi /etc/profile
        ```
        - 在最下面加入
        ```
        #set for nodejs 
　　　　　export NODE_HOME=/usr/local/node  
　　　　　export PATH=$NODE_HOME/bin:$PATH 
        ```
        - 保存并退出，使配置文件生效
        ```
        :wq
        source /etc/profile
        ```
        - 这样就可以使用node命令了，
        - 若还不行，则尝试使用软连接

- 安装pm2：sudo npm install -g pm2

- 若安装完成pm2后，仍无法使用此命令，可尝试引入软连接
    - pm2 软连接 ：
        - ll 查看目录下引入的软连接
        - 如：sudo ln ./pm2 /usr/local/bin/pm2 引入软连接

#### 六、服务器代码上传与项目启动
- 本地上传：（建议上传代码前将node_nodules删掉）
    - 在本地文件夹打开终端，执行如下命令
    - scp -r ./startalk_node darlyn@darlyn:/startalk/download/startalk_node
    - 登录服务器查看是否上传成功
- github上传
- 服务器操作：
- cd /startalk/download/
- 拷贝：cp -rf startalk_node/ ../startalk/startalk_node/
- 进入项目目录：cd /startalk/startalk_node
- ls 查看是否copy成功
- 安装依赖：npm install
- pm2启动：sudo pm2 start ./bin/start --watch
    - 或者 sudo HOME=/root pm2 start /[path]/startalk_node/bin/start --watch
- 项目启动成功后就可以在浏览器输入服务器名+端口访问了

#### 七、其他辅助命令
- sudo netstat -anlp| grep 5000  查看5000 端口的进程
- sudo kill -9 [进程code] 杀死进程
- df -h  查看不同分区的大小
- rm -rf *** 删除文件夹
- sudo pm2 start [启动文件]
- sudo pm2 logs 查看pm2日志
- sudo pm2 list 查看pm2进程list
- sudo pm2 delete [id] 删除pm2进程
- sudo pm2 show [id] 查看详情