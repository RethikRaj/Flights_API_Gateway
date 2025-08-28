const { createProxyMiddleware } = require('http-proxy-middleware');
const { ServerConfig } = require('../config');


// Any request to the apiGateway like http://127.0.0.1:5000/flightsService/api/v1/... will be redirected to http://127.0.0.1:3000/api/v1/... because the target of the proxyMiddleware is http://127.0.0.1:3000 and pathRewrite is used to rewrite the path since in flightServices the starting path is /api/v1/...

const flightServiceProxy = createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite : {'^/flightService' : '/'}
});

const bookingServiceProxy = createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite : {'^/bookingService' : '/'}
});

module.exports = {
    flightServiceProxy,
    bookingServiceProxy
}