
const express = require('express')
const router = express.Router()
const proposalsController = require('../controllers/proposalController')
const authMiddleware = require('../middlewares/authMiddleware')
const employerMiddleware = require('../middlewares/employerMiddleware')
const freelancerMiddleware = require('../middlewares/freelancerMiddleware')

// middleware
router.use(authMiddleware)

// Index route
router.get('/', proposalsController.Index)

// freelancer jobs
router.get('/freelancers', freelancerMiddleware, proposalsController.FreelancersIndex)

// freelancer applied jobs
router.get('/freelancers/applied', freelancerMiddleware, proposalsController.FreelancersAppliedJobs)

// employer proposals
router.get('/employers', employerMiddleware, proposalsController.EmployersIndex)

// employer proposals show
router.get('/employers/:id', employerMiddleware, proposalsController.EmployersShow)

// Store route
router.post('/', employerMiddleware, proposalsController.Store)

// Show route
router.get('/:id', proposalsController.Show)

// Delete route
router.delete('/:id', employerMiddleware, proposalsController.Delete)

// Update route
router.patch('/:id', employerMiddleware, proposalsController.Update)

// Apply for the proposal route
router.put('/apply/:id', freelancerMiddleware, proposalsController.Apply)


module.exports = router