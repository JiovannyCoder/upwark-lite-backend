const mongoose = require('mongoose')
const Schema = mongoose.Schema

const candidatureSchema = require('./schemas/candidatureSchema')

const proposalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    candidates: {
        type: [candidatureSchema]
    }
}, { timestamps: true })

module.exports = mongoose.model('Proposal', proposalSchema)