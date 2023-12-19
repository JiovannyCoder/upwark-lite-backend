const mongoose = require('mongoose')
const Schema = mongoose.Schema

const candidatureSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    freelancer_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = candidatureSchema