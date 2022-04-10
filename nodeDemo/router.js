var api = require('./elastic');
const Chart = require('chart.js');
const fs = require('fs');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function route(pathname, response){
    console.log('[ ' + pathname + ' 경로로 요청 정보 router.js에서 처리]');
    
    fs.readFile('test.html','utf-8', function(error, data){
        if(error){
            response.writeHead(500, {'Content-Type' : 'text/html'});
            response.end('500 Interal server error' + error);
        }else{
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(data);
        }
    });

    // response.writeHead(200,{'Content-Type' : 'text/html'});
    // response.write('This is a node js server page');   // HTTP의 body에 들아가는 부분 
    // response.end(template); 
}

exports.route = route;   //함수를 전역으로 만듬 