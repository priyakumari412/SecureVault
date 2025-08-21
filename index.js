const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { router } = require('./routes/allroutes')
const path = require('path')
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin: `${process.env.BASE_URL}`
}))
app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (res,res)=>{
    res.sendile(path.join(__dirname, 'dist', 'index.html'))
})

mongoose.connect(process.env.dburl).then(() => {
    console.log('db connected')
    app.listen(process.env.port, () => {
        console.log('http://localhost:3005/')
    })
})

app.use('/user', router)


