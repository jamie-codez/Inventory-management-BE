const login = (req, res) => {
    res.send("login");
};

const resetPassword = () => {
    res.send("Reset password");
};

const requestResetPassword = (req, res) => {
    res.send("request reset password");
};

const sendPasswordResetpage = (Req, res) => {
    res.send("sendpasswordReset page");
};

const refreshJwt = (req, res) => {
    res.send("refresh jwt");
};

module.exports = {login,resetPassword,requestResetPassword,sendPasswordResetpage,refreshJwt};