var http = require('http');
var fs = require('fs');
var url = require('url');

var htmldir = "/www";
var port = 80;


netreq=0

// 创建服务器
http.createServer( function (request, response) {  
	var dypage=false;
	
	netreq = netreq + 1;
	
	// 解析请求，包括文件名
	// var pathname = url.parse(request.url).pathname;
	var pathname = url.parse(request.url,true).pathname;
	var pathpart = url.parse(request.url,true).query;
   
	if (pathname == "/" ) {
		//无附加默认重定向index
		var pathname="/index.html";
		console.log("["+netreq+"]index.html");
	} else if ( pathname == "/form" ){
		//表单
		console.log(pathpart.name);
		console.log(pathpart.passwd);
		
		var dypage=true;
	} else {
		//输出信息
		console.log("["+netreq+"]"+htmldir + pathname);
	}


	// 动态页面旋选择
	if (dypage == false) {
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
				response.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>.center {padding: 70px 0;text-align: center;}</style></head><body><p class="center">Notfound</p><p>' + err + '</p></body></html>'); 
			}else{             
				// HTTP 状态码: 200 : OK
				// Content Type: text/${headType}
				//console.log("HeadType:" + headType + "\n");
				
				//根据文件类型更改头部
				if (headType=="gif" || headType=="png" || headType=="jpg") {
					//图片
					response.writeHead(200, {'Content-Type': 'image/' + headType});
				} else if (headType=="svg") {
					//矢量图像
					response.writeHead(200, {'Content-Type': 'image/svg+xml'});
				} else if (headType=="js") {
					//脚本
					response.writeHead(200, {'Content-Type': 'application/javascript'});
				} else {
					//Html以及其他
					//PS:虽然按道理是要的说..但浏览器能识别欸....摆~
					response.writeHead(200, {'Content-Type': 'text/' + headType});   
				}
				// 响应文件内容
				response.write(data);
			}
			//  发送响应数据
			response.end();
		});
	} else {
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.write("你好"+pathpart.name+"大笨蛋");
		//  发送响应数据
		response.end();
	}
}).listen(port);
 
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:' + port + '/');
console.log('-----------\n');
