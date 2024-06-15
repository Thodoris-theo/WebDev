const user_login = require('./user_login');

function loginUser(req, res) {
    const { username, password } = req.body;

    user_login(username, password, (error, success, role) => {
        if (error) {
            console.error('Login error:', error); // Log the error for debugging
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Login attempt:', { username, success, role }); // Log the username for clarity

        if (success) {
            req.session.user = { username, role }; // Assuming session middleware is configured
            redirectToRolePage(req, res, role);
        } else {
            res.status(401).send('Unauthorized: Incorrect username or password'); // Improved error message
        }
    });
}

function redirectToRolePage(req, res, role) {
    // Define your redirection logic here based on user role
    switch (role) {
        case 'patient':
            res.redirect('/patient/dashboard'); // Redirect to patient dashboard
            break;
        case 'doctor':
            res.redirect('/doctor/dashboard'); // Redirect to doctor dashboard
            break;
        case 'secretary':
            res.redirect('/secretary/dashboard'); // Redirect to secretary dashboard
            break;
        default:
            res.status(403).send('Unauthorized access: Your role is not recognized'); // Improved error message
    }
}

module.exports = { loginUser };
