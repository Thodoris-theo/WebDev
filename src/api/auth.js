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
    const rolePages = {
        'patient': '/patient_dashboard',
        'doctor': '/doctor_dashboard',
        'secretary': '/secretary_dashboard'
    };

    if (rolePages[role]) {
        res.json({ success: true, role: role, redirectUrl: rolePages[role] });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized access' });
    }
}


module.exports = { loginUser };
