let express = require('express')
const { data, insert, adduser, finduser, deploys, existuser,subscription,getsubscription ,authenticateuser,getuser,deleteaccount,updateprofile,contact} = require('../controllers/usercontrollers')
const { validate } = require('../middlewares/jwtverify')
let router = express.Router()

router.post('/deploys',deploys)
router.post('/insert', insert)
router.post('/data', data)
router.post('/adduser', adduser)
router.post('/finduser', finduser)
router.post('/existuser', existuser)
router.post('/subscription', subscription)
router.get('/getsubscription', getsubscription)
router.post('/authenticateuser',validate, authenticateuser)
router.post('/getuser', getuser)
router.post('/deleteaccount', deleteaccount)
router.post('/updateprofile', updateprofile)
router.post('/contact', contact)



module.exports = { router }