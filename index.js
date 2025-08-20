const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { router } = require('./routes/allroutes')
require('dotenv').config()
app.use(express.json())
app.use(cors())


mongoose.connect(process.env.dburl).then(() => {
    console.log('db connected')
    app.listen(process.env.port, () => {
        console.log('http://localhost:3005/')
    })
})

app.use('/user', router)


