const jwt = require("jsonwebtoken")

//Middleware to protect restricted resolvers
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization'); //Check if authorization header present or not
    if (!authHeader) {                          // If no header present, no access to restricted resolvers
        req.isAuthenticated = false;
        return next();
    }
    //If Auth Header present, extract token;
    const token = authHeader.split(' ')[1];  //Bearer Token
    if (!token || token === '') {     //If token is empty
        req.isAuthenticated = false;
        return next();
    }
    //Else Check Token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        req.isAuthenticated = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuthenticated = false;
        return next();
    }
    req.isAuthenticated = true;
    req.userId = decodedToken.userId
    next();
}