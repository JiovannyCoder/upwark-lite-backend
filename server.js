require('dotenv').config()
//express
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const corsOptions = {
    origins: process.env.FRONTEND_ORIGIN
}

// routes resources
const proposalsRoutes = require('./routes/proposalRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors(corsOptions))

// routes
app.get('/', (req, res) => {
    res.status(200).json({mssg : "Welcome to upwark lite"})
})

// proposals routes
app.use('/api/proposals', proposalsRoutes)

//user routes
app.use('/api/user', userRoutes)

// db connection and launching app
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('The app is open running in port', process.env.PORT)
        })
    })

    module.exports = app