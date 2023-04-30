const login = async(req, res) => {
    res.send("login");
};

const resetPassword = async(req,res) => {
    res.send("Reset password");
};

const requestResetPassword = async(req, res) => {
    res.send("request reset password");
};

const sendPasswordResetpage = async(req, res) => {
    res.send("sendpasswordReset page");
};

const refreshJwt = async(req, res) => {
    res.send("refresh jwt");
};

module.exports = {login,resetPassword,requestResetPassword,sendPasswordResetpage,refreshJwt};