const express = require('express');
const { ServerConfig , Logger, SwaggerConfig} = require('./config'); // ./config/index.js == ./config
const apiRoutes = require('./routers');
const { RateLimitMiddlewares, ProxyMiddlewares, AuthMiddlewares, InjectUserMiddlewares } = require('./middlewares');

const app = express();



// Swagger Documentation
app.use('/api-docs', SwaggerConfig.swaggerUi.serve, SwaggerConfig.swaggerUi.setup(SwaggerConfig.specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Flight Booking API Gateway Documentation'
}));

// Add rate Limit
app.use(RateLimitMiddlewares.globalRateLimiter);

// Add proxy middlewares
app.use('/flightService',ProxyMiddlewares.flightServiceProxy);
app.use('/bookingService', AuthMiddlewares.checkIsAuthenticated, InjectUserMiddlewares.injectUserData, ProxyMiddlewares.bookingServiceProxy);

// adding middlewares to parse input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, ()=>{
    console.log(`Server is running on port ${ServerConfig.PORT}`);
    Logger.info('Succesfully started the server')
})