const createUser = (req, res) => {
    res.send("Hello createUser");
}

const getUsers = (req, res) => {
    res.send("Hello getUsers");
}

const updateUser = (req, res) => {
    res.send("Hello updateUser");
}

const deleteUser = (req, res) => {
    res.send("Hello deleteUser");
}

module.exports = { createUser, getUsers, updateUser, deleteUser };