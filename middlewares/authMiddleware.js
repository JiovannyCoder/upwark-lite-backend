const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error: 'Authorization is required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id, type} = await jwt.verify(token, process.env.SECRET)

        const user = await User.findOne({_id}).select('_id')
        req.user = user
        next()

    } catch (e) {
        res.status(401).json({error: 'Request is unauthorized'})
    }

}

module.exports = authMiddleware