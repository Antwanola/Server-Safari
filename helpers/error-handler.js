const {CustomAPIError} = require('../errors/custom-error')

const errorHandler = (err, req, res, next)=>{
    if(err instanceof CustomAPIError) return res.status(err.statusCode).json(err.message)
res.status(500).json({error:`Something went wrong please try again in a short while `})
next()
};

module.exports = errorHandler;