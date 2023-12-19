const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createToken = (_id, type) => {
    return jwt.sign({_id, type}, process.env.SECRET, {expiresIn: '3d'})
}
const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id, user.type)

        res.status(200).json({
            name: user.name,
            type: user.type,
            token
        })
    } catch (e) {
        res.status(400).json({error: e.message})
    }
}

const signup = async (req, res) => {
    const {name, email, password, type} = req.body

    try {
        const user = await User.signup(name, email, password, type)

        const token = createToken(user._id, user.type)

        res.status(200).json({
            name: user.name,
            type: user.type,
            token
        })

    } catch (e) {
        res.status(400).json({error: e.message})
    }

}

module.exports = {
    login,
    signup
}