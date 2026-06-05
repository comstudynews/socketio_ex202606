var http = require('http');
var express = require('express');
var app = express();
var path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// 쿠키와 세션 미들웨어
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

// CORD(다중 서버 접속) 지원
// - 클라이언트에서 Ajax 요청 시 필요
var cors = require('cors');

// Express 객체 생성 및 기본 속성 설정
var app = express();
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해서 파싱
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// static 미들웨어로 public 폴더와 uploads 폴더 오픈
app.use('/', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

// cookie-parser와 session 미들웨어 설정
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

// CORS(다중 서버 접속)지원 설정
app.use(cors());

// multer 미들웨어 사용: 미들웨어 사용 순서 
// body-parser -> multer -> router 순으로 실행
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now()+"_"+file.originalname);
    }
});

// 파일 제한: 10개, 1G 이하
var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
})

// 라우터 함수 등록
var router = express.Router();

// 파일 업로드 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
    console.log('/process/photo 호출됨.');
	try {
    var files = req.files;

    console.dir("#===== 업로드된 첫번째 파일 정보 =====#");
    console.dir(req.files[0]);
    console.dir("#=====#");

    // 현재의 파일 정보를 저장할 변수 선언
    var originalname = "",
      filename = "",
      mimetype = "",
      size = 0;

    if (Array.isArray(files)) {
      // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
      console.log("배열에 들어있는 파일 갯수 : %d", files.length);

      for (var index = 0; index < files.length; index++) {
        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        size = files[index].size;
      } // end of  for
    } else {
      // else  부분 계속 이어서 작성 ....
      // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
      console.log("파일 갯수 : 1 ");

      originalname = files[index].originalname;
      filename = files[index].name;
      mimetype = files[index].mimetype;
      size = files[index].size;
    } // end  of  if~else

    console.log(
      "현재 파일 정보 : " +
        originalname +
        ", " +
        filename +
        ", " +
        mimetype +
        ", " +
        size,
    );

    // 클라이언트에 응답 전송
    res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
    res.write("<h3>파일 업로드 성공</h3>");
    res.write("<hr/>");
    res.write(
      "<p>원본 파일명 : " +
        originalname +
        " -> 저장 파일명 : " +
        filename +
        "</p>",
    );
    res.write("<p>MIME TYPE : " + mimetype + "</p>");
    res.write("<p>파일 크기 : " + size + "</p>");
    res.end();
  } catch(err) {
		console.dir(err.stack);
	} // end of try~catch

});

// router 객체를 미들웨어 등록하기 (맨아랫쪽 서버 실행 전에 등록)
app.use(router);

var server = http.createServer(app).listen(3000, function() {
    console.log('서버가 실행 되었습니다 : ', 3000);
});

// chat_ex01.js 불러오기 (server에서 module 실행)
require("./chat_ex01")(server)
