/**
 * Middleware to inject authenticated user data into request headers
 * This allows microservices to access user information without making additional API calls
 */

async function injectUserData(req, res, next) {
    try {
        // req.user is already set by checkIsAuthenticated middleware
        if (req.user) {
            // Inject user data into headers so the downstream service can access it
            req.headers['x-user-id'] = req.user.id?.toString();
            req.headers['x-user-email'] = req.user.email;
            req.headers['x-user-username'] = req.user.username;
            
            console.log('User data injected into headers:', {
                userId: req.user.id,
                email: req.user.email,
                username: req.user.username
            });
        }
        next();
    } catch (error) {
        console.error('Error in injectUserData middleware:', error);
        // Continue even if there's an error - let the downstream service handle missing data
        next();
    }
}

module.exports = {
    injectUserData
};
