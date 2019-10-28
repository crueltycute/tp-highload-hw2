var express = require('express');
var router = express.Router();

const OK = 200;
const NOT_OK = 500;

let serverResponseOK = true;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/ok', function(req, res, next) {
  res.sendStatus(serverResponseOK ? OK : NOT_OK);
  serverResponseOK = true;
  // res.render('ok', { title: 'OK' });
});

router.get('/api/notok', function(req, res, next) {
  res.sendStatus(serverResponseOK ? OK : NOT_OK);
  serverResponseOK = false;
});

router.get('/api/status', function(req, res, next) {
  res.sendStatus(serverResponseOK ? OK : NOT_OK);
});

router.get('/api/data', function(req, res, next) {
  if (serverResponseOK) {
    setTimeout(() => {
      const data = {
        string: 'Request paused for 2 seconds',
        status: OK
      };
      res.send(JSON.stringify(data));
    }, 2000);
  } else {
    setTimeout(() => {
      const data = {
        string: 'Request paused for 10 seconds',
        status: NOT_OK
      };
      res.send(JSON.stringify(data));
    }, 10000);
  }
});

module.exports = router;
