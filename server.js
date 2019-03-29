'use strict';
var proxy = require('http-proxy-middleware');
var Promise = global.Promise || require('promise');
var nodeConfig = require('./node_config');
var path = require('path');
var express = require('express'),
    exphbs  = require('express-handlebars'), // "express-handlebars"
    helpers = require('./lib/helpers');

var app = express();
var nodeConfig = require("./node_config");
// 默认布局
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: helpers,
    // 分区目录
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ]
});

// engine函数 注册hbs
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Powered-By', 'QXF');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// 将应用程序的模板 --> 应用程序的客户端，获取相应的页面
function exposeTemplates(req, res, next) {
    // 预编译模板
    hbs.getTemplates('shared/templates/', {
        cache: app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // 删除扩展名 .handlebars
        var extRegex = new RegExp(hbs.extname + '$');
        // 模板数组
        templates = Object.keys(templates).map(function (name) {
            return {
                name : name.replace(extRegex, ''),
                template: templates[name]
            };
        });
        // 显示
        if (templates.length) {
            res.locals.templates = templates;
        }
        setImmediate(next);
    })
    .catch(next);
}

app.get('/', function (req, res) {
    var deviceArr = ['Android', 'iPhone', 'iPad'];
    var userAgent = req.headers["user-agent"];
    var i, len;
    for (i = 0, len = deviceArr.length; i < len; i++) {
        // if (userAgent.indexOf(deviceArr[i]) !== -1) {
        //     //touch
        //     res.render('touch', {
        //         title: nodeConfig.touch.title||"Startalk",
        //         appId:"app",
        //         stycss: nodeConfig.touch.stycss||"./default.css",
        //         scrcss: nodeConfig.touch.scrcss||"./default.css",
        //         scrjs: nodeConfig.touch.scrjs||"./default.js",
        //         sdkjs: nodeConfig.web.sdkjs ||"./default.js",
        //         // yell --- helper.
        //         helpers: {
        //             yell: function (msg) {
        //                 return (msg + '!!!');
        //             }
        //         }
        //     });
        //     return;
        // }
    }
    //web
    res.render('web', {
        title: nodeConfig.web.title ||"Startalk",
        appId:"app",
        stycss: nodeConfig.web.stycss ||"./default.css",
        scrcss: nodeConfig.web.scrcss ||"./default.css",
        scrjs: nodeConfig.web.scrjs ||"./default.js",
        sdkjs: nodeConfig.web.sdkjs ||"./default.js",
    });
});
//接口转发
app.all('/newapi/*', proxy({
    target: nodeConfig.httpurl,
    changeOrigin: true, 
    pathRewrite:{
        '/newapi': '', // rewrite path
    }
}));
app.all('/api/*', proxy({ 
    target: nodeConfig.apiurl,
    changeOrigin: true, 
    pathRewrite:{
        '/api': '', // rewrite path
    }
}));
app.all('/package/*', proxy({ 
    target: nodeConfig.javaurl,
    changeOrigin: true, 
    pathRewrite:{
        '/package': '', // rewrite path
    }
}));
app.all('/search/search.py', proxy({ 
    target: nodeConfig.searchurl,
    changeOrigin: true, 
    pathRewrite:{
        '/search/search.py': '', // rewrite path
    }
}));

app.get('/echo/:message?', exposeTemplates, function (req, res) {
    res.render('echo', {
        title  : 'Echo',
        message: req.params.message,
        // 重写布局
        layout: 'shared-templates',
        partials: Promise.resolve({
            echo: hbs.handlebars.compile('<p>ECHO: {{message}}</p>')
        })
    });
});

module.exports = app;
