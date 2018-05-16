//连接数据库
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/texi');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connect success!")
  // we're connected!
});
