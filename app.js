const express = require('express');
const client = require('prom-client');
const apiMetrics = require('prometheus-api-metrics');

const router = express();
const routerMetrics = express();

const OK = 200;
const NOT_OK = 500;

let serverResponseOK = true;

const metricsRequest = new client.Counter({
    name: 'request',
    help: 'kek',
    labelNames: ['req200', 'req500'],
});

const registry = new client.Registry();
registry.registerMetric(metricsRequest);

routerMetrics.use(apiMetrics());

router.get('/api/ok', function(req, res, next) {
    metricsRequest.inc(serverResponseOK ? {'req200': '/api/ok'} : {'req500': '/api/ok'}, 1);
    res.sendStatus(serverResponseOK ? OK : NOT_OK);
    serverResponseOK = true;
});

router.get('/api/notok', function(req, res, next) {
    metricsRequest.inc(serverResponseOK ? {'req200': '/api/notok'} : {'req200': '/api/notok'}, 1);
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
                string: 'Request paused for 2 milliseconds',
                status: OK
            };
            metricsRequest.inc(serverResponseOK ? {'req200': '/api/data'} : {'req500': '/api/data'}, 1);
            res.send(JSON.stringify(data));
        }, 200);
    } else {
        setTimeout(() => {
            const data = {
                string: 'Request paused for 2 milliseconds',
                status: NOT_OK
            };
            metricsRequest.inc(serverResponseOK ? {'req200': '/api/notok'} : {'req500': '/api/notok'}, 1);
            res.send(JSON.stringify(data));
        }, 200);
    }
});

router.listen(80);
routerMetrics.listen(8080);
