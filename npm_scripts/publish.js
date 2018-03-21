const http = require('http');
const publish = args => {
  const options = {
    hostname: 'test.proxy.51ykb.com',
    port: 80,
    path: '/ykb_code/index/exe?run=train_mobile',
    method: 'GET',
    // auth: 'admin:admin123456qqq',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM0NTZxcXE='
    }
  };
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('Successfully published.');
      if (args.callback && typeof args.callback === 'function') {
        args.callback();
      }
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.end();
}
module.exports = publish