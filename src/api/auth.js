const user_login = require('./user_login');

function loginUser(req, res) {
    const { username, password } = req.body;

    user_login(username, password, (error, success, role) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Login attempt:', { success, role });
        if (success) {
            req.session.user = { username, role };
            redirectToRolePage(req, res, role);
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
}

function redirectToRolePage(req, res, role) {
    const rolePaths = {
        'patient': '/patient',
        'doctor': '/doctor',
        'secretary': '/secretary'
    };
    if (rolePaths[role]) {
        res.json({ redirectUrl: rolePaths[role] });  // Στέλνει JSON με την URL
    } else {
        res.status(403).send('Unauthorized access');
    }
}


module.exports = { loginUser };
