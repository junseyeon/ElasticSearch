var server = require('./server');
var router = require('./router');

server.start(router.route);  // server.js에서 전역으로 만든 start()함수 사용 / server에서 router부름 

