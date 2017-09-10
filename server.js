var tls = require('tls');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/home/vikrambhosle402/server-key'),
  cert: fs.readFileSync('/home/vikrambhosle402/server-crt')
};

tls.createServer(options, function (s) {
  s.write("welcome!\n");
  s.pipe(s);
}).listen(8000);
