const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

// user schema
const userSchema = require('./schemas/userSchema')

userSchema.statics.employerType = "employer"
userSchema.statics.freelancerType = "freelancer"

userSchema.statics.signup = async function (name, email, password, type) {
    const existingEmail = await this.findOne({email})

    if(existingEmail) {
        throw Error('Email already in use')
    }

    //validation
    if(!name || !email || !password || !type) {
        throw Error('All field are required')
    }
    if(!validator.isEmail(email)) {
        throw Error('Email must be a valid email')
    }
    if(name.length < 3) {
        throw Error('Username must be at least 3 chars')
    }
    if(!name.trim().length > 0) {
        throw Error('Username invalid')
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Password not enough strong')
    }
    if(type !== this.freelancerType && type !== this.employerType ) {
        throw Error("User type invalid")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({name, email, password: hash, type})

    return user
}

userSchema.statics.login = async function(email, password) {
    //validation
    if(!password || !email) {
        throw Error('All field are required')
    }

    const user = await this.findOne({email})
    if(!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match) {
        throw Error('Invalid credentials')
    }

    return user
}


module.exports = mongoose.model('User', userSchema)