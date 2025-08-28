const express = require('express');
const { ServerConfig , Logger} = require('./config'); // ./config/index.js == ./config
const apiRoutes = require('./routers');
const { RateLimitMiddlewares } = require('./middlewares');

const app = express();

// adding middlewares to parse input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add rate Limit
app.use(RateLimitMiddlewares.globalRateLimiter);

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, ()=>{
    console.log(`Server is running on port ${ServerConfig.PORT}`);
    Logger.info('Succesfully started the server')
})