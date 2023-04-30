const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({ code:500,message: err.message });
    throw new Error(err.message);
};

module.exports = errorHandler;