const Proposal = require('../models/Proposal')
const mongoose = require('mongoose')
const User = require('../models/User')

// Global Index 
const Index = async (req, res) => {
    const proposals = await Proposal.find()
        .populate({ path: 'user_id', select: 'name -_id' })
        .sort({ createdAt: -1 })

    res.status(200).json(proposals)
}

// Freelancer Index
const FreelancersIndex = async (req, res) => {
    const proposals = await Proposal.find({ 'candidates.freelancer_id': { $ne: req.user._id } })
        .populate({ path: 'user_id', select: 'name -_id' })
        .sort({ createdAt: -1 })

    res.status(200).json(proposals)
}

// Applied jobs
const FreelancersAppliedJobs = async (req, res) => {
    const proposals = await Proposal.find({ 'candidates.freelancer_id': req.user._id })
        .populate({ path: 'user_id', select: 'name -_id' })
        .sort({ createdAt: -1 })

    res.status(200).json(proposals)
}

// Employer Index
const EmployersIndex = async (req, res) => {
    const user_id = req.user._id
    const proposals = await Proposal.find({ user_id })
        .sort({ createdAt: -1 })

    res.status(200).json(proposals)
}

// Show
const EmployersShow = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Id must be a valid id' })
    }

    const proposal = await Proposal.findOne({ _id: id })
        .populate([
            { path: 'user_id', select: 'name -_id' },
            {path: 'candidates.freelancer_id', select: 'name -_id email'}
        ])

    if (!proposal) {
        return res.status(400).json({ error: 'No such proposal here' })
    }
    res.status(200).json(proposal)

}

// Employer Store
const Store = async (req, res) => {
    const { title, details, price } = req.body
    const user_id = req.user._id

    try {
        const proposal = await Proposal.create({ title, details, price, user_id })
        res.status(200).json(proposal)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}

// Show
const Show = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Id must be a valid id' })
    }

    const proposal = await Proposal.findOne({ _id: id })
        .populate({ path: 'user_id', select: 'name -_id' })

    if (!proposal) {
        return res.status(400).json({ error: 'No such proposal here' })
    }
    res.status(200).json(proposal)

}

// Delete
const Delete = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Id must be a valid id' })
    }
    const proposal = await Proposal.findOneAndDelete({ _id: id })
    if (!proposal) {
        return res.status(400).json({ error: 'No such proposal here' })
    }
    res.status(200).json(proposal)
}

// Update
const Update = async (req, res) => {
    const { id } = req.params
    const body = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Id must be a valid id' })
    }
    try {
        const proposal = await Proposal.findOneAndUpdate({ _id: id }, { ...body })
        res.status(200).json(proposal)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }

}

const Apply = async (req, res) => {
    const proposal_id = req.params.id
    const user_id = req.user._id
    const { message } = req.body

    // proposal validation
    if (!mongoose.Types.ObjectId.isValid(proposal_id)) {
        return res.status(400).json({ error: 'Id must be a valid id' })
    }

    const proposal_exists = await Proposal.findOne({ _id: proposal_id })
    if (!proposal_exists) {
        return res.status(400).json({ error: 'No such a proposal to apply' })
    }

    // request validation
    if (!message) {
        return res.status(400).json({ error: 'All fields for applying are required' })
    }

    // verify if the user already apply to the proposal
    const cannotApply = proposal_exists.candidates.some(item => item.freelancer_id.toString() === user_id.toString())
    if (cannotApply) {
        return res.status(400).json({ error: "You have already apply to this proposal" })
    }

    try {
        const proposal = await Proposal.findOneAndUpdate({ _id: proposal_id }, { candidates: [...proposal_exists.candidates, { message, freelancer_id: user_id }] })
        res.status(200).json(proposal)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}

module.exports = {
    Index,
    Store,
    Show,
    Delete,
    Update,
    Apply,
    FreelancersIndex,
    FreelancersAppliedJobs,
    EmployersIndex,
    EmployersShow
}