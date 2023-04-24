const createUser = async (req, res) => {
    res.send("Hello createUser");
}

const getUsers = async (req, res) => {
    res.send("Hello getUsers");
}

const updateUser = async (req, res) => {
    res.send("Hello updateUser");
}

const deleteUser = async (req, res) => {
    res.send("Hello deleteUser");
}

module.exports = { createUser, getUsers, updateUser, deleteUser };