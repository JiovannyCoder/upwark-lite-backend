const jwt = require("jsonwebtoken");
const User = require("../models/User");
const employerMiddleware = async (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error: 'Authorization is required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id, type} = await jwt.verify(token, process.env.SECRET)

        if(type !== User.employerType) {
            return res.status(401).json({error: "Only employer can go here"})
        }

        next()
    } catch (e) {
        res.stat(401).json({error: 'Request is unauthorized'})
    }
}
module.exports = employerMiddleware