var http = require('http');
var url = require('url');

//익명함수 -방법1
// http.createServer(function( req, res){
//     res.writeHead(200,{'Content-Type' : 'text/plain'});
//     res.write('hello nodejs node node');
//     res.end();
// }).listen(8888);

//기명 - 방법2

function start(route){  
    function onRequest( req, res) {   /* 비동기 함수 */

        /* server.js에처 처리할 내용을 router.js로 해서 의존성 주입 */
        var pathname = url.parse(req.url).pathname;    //.pathname -> query로 변경 가능 
        console.log('[server.js 요청] requrest for' + pathname + 'received');
        
        route(pathname, res);    //response객체를 route로 넘김 
    }
    http.createServer(onRequest).listen(8080);
    
    console.log('server started');
}

exports.start = start;    //exports global변수 




