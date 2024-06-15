function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(403).send('Unauthorized access');
}

module.exports = isAuthenticated;
