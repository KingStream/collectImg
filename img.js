var fs = require('fs')
var http = require('http')
var https = require('https')
var querystring = require('querystring')
var image = require('imageinfo') //引用imageinfo模块
var path = require('path') //解析需要遍历的文件夹
var filePath = path.resolve('./image')

// https.get('https://detail.1688.com/offer/603347646437.html?spm=a2615.7691456.autotrace-offerGeneral.1.35386338OglQ7x#', function(res) {
//     var html = '';
//     // 绑定data事件 回调函数 累加html片段
//     res.on('data', function(data) {
//         html += data;
//     });

//     res.on('end', function() {
//         console.log(html);
//     });
// })

//文件遍历方法

var server = http.createServer(function(req, res) {
    let url = req.url
    console.log('当前页面地址' + url)
    if (url === '/') {
        fs.readFile('img.html', function(err, data) {
            if (err) {
                res.end('失败啦')
            } else {
                res.end(data)
            }
        })
    } else if (url === '/jquery.js') {
        fs.readFile('jquery.js', function(err, data) {
            if (err) {
                res.end('失败啦')
            } else {
                res.end(data)
            }
        })
    } else if (url.indexOf('/image/') != -1) {
        fs.readdir(filePath, function(err, files) {
            if (err) {
                res.end('失败')
            } else {
                console.log(JSON.stringify(files))
                files.forEach((item) => {
                    let detailDir = path.join(filePath, item)
                    fs.stat(detailDir, function(eror, stats) {
                        if (err) {} else {
                            var isFile = stats.isFile() //是文件
                            var isDir = stats.isDirectory() //是文件夹
                            if (isFile) {
                                if (url == '/image/' + item) {
                                    fs.readFile(detailDir, function(err, data) {
                                        if (err) {
                                            res.end('失败啦')
                                        } else {
                                            res.end(data)
                                        }
                                    })
                                }
                            }
                            if (isDir) {}
                        }
                    })
                })
            }
        })
    } else if (url === '/img' && req.method.toLowerCase() === 'post') {
        // 定义了一个post变量，用于暂存请求体的信息
        var post = ''

        // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        req.on('data', function(chunk) {
            post += chunk
        })

        // let dataString = post.toString();
        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function() {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8')
            res.end('成功')
            post = JSON.parse(post)
            for (let i = 0; i < post.length; i++) {
                if (post[i].indexOf('.32x32') != -1) {
                    post[i] = post[i].replace(/.32x32/, '').trim()
                }
            }
            for (let i = 0; i < post.length; i++) {
                https.get(post[i], function(res) {
                    var img = ''
                        // 绑定data事件 回调函数 累加html片段
                    res.on('data', function(data) {
                        img += data
                    })
                    res.setEncoding('binary') //一定要设置response的编码为binary否则会下载下来的图片打不开
                    res.on('end', function() {
                        let url = path.join(filePath, post[i].split('/')[post[i].split('/').length - 1])
                        fs.stat(url, function(err, stats) {
                            if (err) {
                                fs.writeFile('C:\\Users\\k1760\\Desktop\\niu\\image\\' + post[i].split('/')[post[i].split('/').length - 1], img, 'binary', function(err) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log('图片保存成功')
                                })
                            } else {

                            }
                        })
                    })
                })
            }
        })
    }
})

server.listen(3000, function() {
    console.log('运行')
})