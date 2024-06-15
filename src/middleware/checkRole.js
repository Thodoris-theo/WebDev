function checkRole(role) {
    return function(req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            return next();
        }
        res.status(403).send('Unauthorized access');
    }
}

module.exports = checkRole;
