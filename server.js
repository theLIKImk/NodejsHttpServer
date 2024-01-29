var http = require('http');
var fs = require('fs');
var url = require('url');

var htmldir = "/html";
var port = 80;
 
// 创建服务器
http.createServer( function (request, response) {  
	// 解析请求，包括文件名
	// var pathname = url.parse(request.url).pathname;
	var pathname = url.parse(request.url,true).pathname;
   
	//无附加默认重定向index
	if (pathname == "/" ) {
		var pathname="/index.html";
		console.log("index.html");
	} else {
		//输出信息
		console.log(htmldir + pathname);
	}
   
	//设定html目录
	var pathname= htmldir + pathname;
   
   	//获取文件类型
	var pathname_f = '.' + pathname;
	var headType = pathname_f.substr(pathname_f.lastIndexOf(".") + 1, pathname_f.length);
	var fileName = pathname_f.substr(pathname_f.lastIndexOf("/") + 1, pathname_f.length);
   
	// 从文件系统中读取请求的文件内容
	fs.readFile(pathname.substr(1), function (err, data) {
		if (err) {
			console.log(err + "\n" );
			// HTTP 状态码: 404 : NOT FOUND
			// Content Type: text/html 
			response.writeHead(404, {'Content-Type': 'text/html'});
			response.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>.center {padding: 70px 0;text-align: center;}</style></head><body><p class="center">Notfound</p></body></html>'); 
		}else{             
			// HTTP 状态码: 200 : OK
			// 自动获取头部
			// Content Type: text/${headType}
			console.log("HeadType:" + headType + "\n");
			response.writeHead(200, {'Content-Type': 'text/' + headType});   
			          
			// 响应html文件内容
			response.write(data);

			//  发送响应数据
			response.end();
		}
	});   
}).listen(port);
 
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:' + port + '/');
console.log('-----------\n');
