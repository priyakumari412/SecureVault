const jwt = require('jsonwebtoken')
require('dotenv').config()
const joi = require('joi')
const validate = async (req, res, next) => {
    let { masterpassword, username } = req.body
    let obj = joi.object({
        masterpassword: joi.string().trim().replace(/\s+/g, '').required()
    })

    const { value, error } = obj.validate({
        masterpassword
    })

    if (error) {
        res.send({
            msg: 'joi error',
            error
        })
        return
    }
    
    try {
        let token = await req.headers.authorization
        if (!token) {
            res.send({
                error: 'token required!'
            })
        }
        if (!username || !masterpassword) {
            res.send({
                error: 'All fields are required!'
            })
            return
        }
        let verify = jwt.verify(token, process.env.JWT_SECRET)
        if (verify !== value.masterpassword) {
            res.send({
                error: 'User not authenticated!'
            })
            return
        }
        next()
    } catch (error) {
        console.log(error)
        res.send({
            error
        })
        return
    }

}


module.exports = { validate }