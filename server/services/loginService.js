const fileService = require('./fileService');

exports.authenticate = (credential) => {
    const { email, password } = { ...credential };
    const users = fileService.getFileContents('../data/users.json');

    const authObject = users.reduce((authObj, user) => {
        if (user.email == email) {
            authObj.validEmail = true;
        }
        if (user.password == password) {
            authObj.validPassword = true;
        }
        if (authObj.validEmail == true && authObj.validPassword == true) {
            authObj.user = user;
        }
        return authObj;
    }, { validEmail: false, validPassword: false, user: null });

    const authUser = authObject.user ? {user: authObject.user} : formatErrors(authObject);
    return authUser;
};


const formatErrors = function (user) {
    let passwordWarning = "";
    let emailWarning = "";
    if (user.validEmail === false) {
        emailWarning = `Email doesn't seem to be correct`;
    }
    if (user.validPassword === false) {
        passwordWarning = `Password doesn't seem to be correct`;
    }
    return { user: null, emailWarning, passwordWarning }
};