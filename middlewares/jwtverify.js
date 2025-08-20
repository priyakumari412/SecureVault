const jwt = require('jsonwebtoken')
require('dotenv').config()
const validate = async (req, res, next) => {
    let { masterpassword,username } = req.body
    // console.log(req.body.masterpassword)
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
        if (verify !== masterpassword) {
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