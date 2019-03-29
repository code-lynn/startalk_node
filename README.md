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
    - pm2@>=2.0.0

- 如果您具备本地开发条件，本地电脑安装了node，git等环境配置，则建议先从github上，将startalk_web和startalk_web_sdk项目fork到自己的git仓库，然后再git clone到本地去修改配置，查看无误后提交到自己的仓库，以便查看修改记录，再参考服务器直接部署策略进行部署。
- 如果您不具备本地开发条件，则建议您直接采用以下服务器直接部署策略。
- 以下是服务器直接部署策略（与后台服务部署在一台机器为例）

## 服务器直接部署策略

### 一、下载代码到服务器
- 登录服务器后，在download目录下下载源码,然后将项目copy到startalk目录下进行操作。
```
    cd /startalk/download
    git clone https://github.com/qunarcorp/startalk_web_sdk.git
    git clone https://github.com/qunarcorp/startalk_web.git
    git clone https://github.com/qunarcorp/startalk_node.git
    cp -rf  startalk_web_sdk /startalk/startalk_web_sdk
    cp -rf startalk_web /startalk/startalk_web
    cp -rf startalk_node /startalk/startalk_node
```

### 二、服务器环境安装(root用户)
- 进入下载目录
```
    cd /startalk/download
```
- 安装node：
```
    wget https://npm.taobao.org/mirrors/node/v8.6.0/node-v8.6.0-linux-x64.tar.xz
    tar -xvf  node-v8.6.0-linux-x64.tar.xz
    cd  node-v8.6.0-linux-x64/bin
```
- 执行以下命令，若显示 v8.6.0 ，则表明安装成功
```
    ./node -v
```
- 配置软连接，便于全局使用 node npm命令
```
    ln -s /startalk/download/node-v8.6.0-linux-x64/bin/node /usr/local/bin/node
    ln -s /startalk/download/node-v8.6.0-linux-x64/bin/npm /usr/local/bin/npm
```
- 分别执行以下命令，若返回版本号，则表示配置成功
```
    node -v
    npm -v
```
- 安装pm2
```
    npm install -g pm2
```
- 配置软连接，便于全局使用 pm2命令
```
    ln -s /startalk/download/node-v8.6.0-linux-x64/bin/pm2 /usr/local/bin/pm2
```
- 执行以下命令，若返回版本号，则表示配置成功
```
    pm2 -v
```

### 三、startalk_web_sdk项目配置

#### 1、安装依赖
```
    cd /startalk/startalk_web_sdk
    npm install 
```
#### 2、修改配置
- 修改startalk_web_sdk项目目录下的 sdk_config.js 文件,执行以下命令进入编辑状态
```
    vim /startalk/startalk_web_sdk/sdk_config.js
```
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看浏览器中返回的json数据
- 若浏览器查看json数据不清晰，可以打开 https://www.json.cn 将返回数据粘贴到左侧窗口，右侧会自动生成解析后的json数据
- 公钥pub_key_fullkey获取方法：
    - 将导航链接返回数据中的javaUrl，拼接上 /qtapi/nck/rsa/get_public_key.do ，再粘贴到浏览器中访问
    - 在返回数据中，找到pub_key_fullkey对应的值，粘贴到配置文件中pub_key_fullkey后即可
- 配置文件sdk_config.js说明：
    - "domain":"",//公司域名
    - "fileurl":"",//静态文件
    - "javaurl":"",//后台接口 package接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
    - "pub_key_fullkey":"",//公钥
- 找到导航链接返回数据中相同key字段对应的value值，填入到sdk_config.js文件中即可
- 编辑完成后，请仔细检查配置文件格式，在末行模式下，输入以下命令,保存退出vim编辑
```
    esc键
    :wq
    回车
```

#### 3、prod打包
- 执行build操作后，会在prd目录下生成 qtalk_web_sdk@version.js 文件
- 然后拷贝到node项目的public文件夹下，用于html引入
```
    npm run build:prod
    cp -rf /startalk/startalk_web_sdk/prd/* /startalk/startalk_node/public
```

### 四、startalk_web项目配置

#### 1、安装依赖
```
    cd /startalk/startalk_web
    npm install 
```

#### 2、修改配置
- 修改startalk_web项目目录下的 web_config.js 文件,执行以下命令进入编辑状态
```
    vim /startalk/startalk_web/web_config.js
```
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看浏览器中返回的json数据
- 若浏览器查看json数据不清晰，可以打开 https://www.json.cn 将返回数据粘贴到左侧窗口，右侧会自动生成解析后的json数据
- 其中websocket字段需单独写入配置，"websocket":[本机IP:5280],
- 配置文件web_config.js说明：
    - "domain":"",//公司域名
    - "websocket":"",//ws服务器及端口
    - "javaurl":"",//后台接口 package接口
    - "emails":"darlyn"//email后缀（暂不支持，不用配置）
- 其它字段需找到导航链接返回数据中相同key字段对应的value值，填入到web_config.js文件中即可
- 编辑完成后，请仔细检查配置文件格式，在末行模式下，输入以下命令,保存退出vim编辑
```
    esc键
    :wq
    回车
```

#### 3、prod打包
- 执行build操作，分别在prd/js和prd/css目录下生成 index@version.js 和index@version.css文件
- 然后拷贝到node项目的public文件夹下，用于html引入
```
    npm run build:prod
    cp -rf /startalk/startalk_web/prd/js/* /startalk/startalk_node/public
    cp -rf /startalk/startalk_web/prd/css/* /startalk/startalk_node/public
```

### 五、startalk_node项目配置、启动服务

#### 一、安装依赖
```
    cd /startalk/startalk_node
    npm install
```

#### 二、查看 js、css、sdk文件导入
- 在 startalk_web_sdk项目和startalk_web项目配置中，已经将项目所需的qtalk_web_sdk@version.js、index@version.js、index@version.css等文件复制到了该项目public文件夹下
- 执行以下命令，查看是否copy成功，并且记录相应版本号，便于配置node_config.js文件
```
    cd /startalk/startalk_node/public
    ls
```

#### 三、修改配置
- 修改startalk_node项目目录下的 node_config.js 文件，执行以下命令进入编辑状态
```
    vim /startalk/startalk_node/node_config.js
```
- 将后台部署后生成的导航链接，粘贴到浏览器中访问，查看浏览器中返回的json数据
- 若浏览器查看json数据不清晰，可以打开 https://www.json.cn 将返回数据粘贴到左侧窗口，右侧会自动生成解析后的json数据
- node_config.js文件说明：
    - "fileurl":"",//后台接口
    - "javaurl":"",//后台接口
    - "httpurl":"",//后台接口
    - "apiurl":"",//后台接口
    - "searchurl":"",//后台接口
    - web：//静态资源路径
        - title:自定义项目标题
        - stycss:web项目 css路径--public文件夹下的的index@version.css文件名
        - scrcss:web项目 css路径--public文件夹下的的css文件名（没有第二个css可不填）
        - sdkjs: sdk路径--public文件夹下的qtalk_web_sdk@version.js文件名
        - scrjs: web项目 cjs路径--public文件夹下的的index@version.js文件名
- 后台接口的配置需找到导航链接返回数据中相同key字段对应的value值，填入到node_config.js文件中即可
- web下面的是静态资源文件路径，根据之前记录下来的js和css文件名，分别填入到node_config.js文件中即可
- 编辑完成后，请仔细检查配置文件格式，在末行模式下，输入以下命令,保存退出vim编辑
```
    esc键
    :wq
    回车
```

#### 五、项目启动与预览
- 使用pm2启动node项目
```
    cd /startalk/startalk_node
    pm2 start ./bin/start --watch
```
- 执行以下命令，查看是否启动成功，若该项目对应的status为online，则表明启动成功
```
    pm2 list
```
- 跨域处理：由于后台服务接口部署和前端node项目服务不是同一个端口，则需要通过本机安装的ngx服务配置转发，以解决接口调用的跨域问题
- 项目预览：
    - 项目启动成功后，在电脑浏览器中输入 [本机IP:5000],回车键访问，输入测试账号1登录，（测试账号test，密码testpassword）
    - 在本电脑打开一个其他的浏览器，同样输入[本机IP:5000],并回车键访问，输入测试账号2登录（账号：test2，密码:test）
    - 在测试账号1的聊天界面搜索用户test2，并发送消息，即可在测试账号2的聊天界面收到聊天信息
    - 至此，您便可享用web版及时通信聊天工具。



#### 七、其他辅助命令（部署成功后不需要执行）
- sudo netstat -anlp| grep 5000  查看5000 端口的进程
- sudo kill -9 [进程code] 结束进程
- df -h  查看不同分区的大小
- rm -rf *** 删除文件夹
- pm2 start [启动文件]
- pm2 log 查看pm2日志
- pm2 list 查看pm2启动项目清单及状态
- pm2 delete [id] 删除pm2进程
- pm2 show [id] 查看项目启动详情
