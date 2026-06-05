var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app).listen(3000, function() {
    console.log('서버가 실행 되었습니다 : ', 3000);
});

// chat_ex01.js 불러오기 (server에서 module 실행)
require("./chat_ex01")(server)
