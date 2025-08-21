const { Model } = require("../models/model")
const { usermodel } = require("../models/usermodel")
const bcrypt = require('bcrypt')
const joi = require('joi')
require('dotenv').config()
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)
const crypto = require('crypto')
const archiver = require('archiver')
const jwt = require('jsonwebtoken')
const { subscriptionModel } = require("../models/subscription")
const { contactModel } = require("../models/contact")


let adduser = async (req, res) => {

    let { username, email, masterpassword } = req.body
    let existuser = await usermodel.findOne({ username: username })


    if (existuser) {
        res.send({
            error: 'user already exist!'
        })
        return
    }


    // console.log(existuser)
    let obj = joi.object({
        username: joi.string().lowercase().min(3).trim().replace(/\s+/g, '').required(),
        email: joi.string().email().lowercase().trim().replace(/\s+/g, '').required(),
        masterpassword: joi.string().min(8).trim().replace(/\s+/g, '').required()
    })

    let { value, error } = obj.validate({
        username,
        email,
        masterpassword
    })

    if (error) {
        res.send({
            error: error.details[0].message,
        })
        return
    }
    else {
        let passwordhash = await bcrypt.hash(value.masterpassword, 10)
        let addobj = await new usermodel({
            username: value.username,
            email: value.email,
            masterpassword: passwordhash
        })
        await addobj.save()
        let token = jwt.sign(value.masterpassword, process.env.JWT_SECRET)
        res.send({
            msg: 'user added!',
            addobj,
            token
        })
    }

}

let finduser = async (req, res) => {
    try {
        let { username, masterpassword } = req.body
        let obj = joi.object({
            username: joi.string().lowercase().min(3).trim().replace(/\s+/g, '').required(),
            masterpassword: joi.string().min(8).trim().replace(/\s+/g, '').required()
        })

        let { value, error } = obj.validate({
            username,
            masterpassword
        })

        if (error) {
            res.send({
                error: error.details[0].message,
            })
            return
        }
        let founduser = await usermodel.findOne({ username: value.username })

        if (!founduser) {
            if (!username || !masterpassword) {
                res.send({
                    error: 'All fields are required!'
                })
                return
            }
            if (username && masterpassword && founduser == null) {
                res.send({
                    error: 'User not exist!'
                })
                return
            }
        }

        let originalpassword = await bcrypt.compare(masterpassword, founduser.masterpassword)
        if (originalpassword !== true) {
            res.send({
                error: 'Please enter valid masterpassword!'
            })
            return

        }
        else {

            let token = jwt.sign(masterpassword, process.env.JWT_SECRET)
            res.send({
                msg: 'user found!',
                user: founduser,
                token: token
            })
        }



    } catch (error) {
        res.send({
            error,
        })
    }



}

let insert = async (req, res) => {
    let { user, title, website, useriv, username, password, passiv, salt } = req.body

    try {
        let checkuser = await usermodel.findOne({ _id: user })
        if (checkuser.subscription == false) {
            let checklimit = await Model.find({ user: checkuser })
            if (checklimit.length >= 5) {
                res.send({
                    limit: 'You reached at your free plan limit!'
                })
                return
            }
        }


        let addobj = await new Model(
            {
                user,
                title,
                website,
                username,
                password,
                passiv,
                useriv,
                salt
            }
        )
        await addobj.save()

        res.send({
            msg: 'data inserted..',
            addobj
        })
    } catch (error) {
        res.send({
            error: error.message
        })
    }



}

let data = async (req, res) => {
    let { objectid } = req.body
    let data = await Model.find({ user: objectid })
    res.send(
        {
            msg: 'data is here...',
            data,
        }
    )
}

let deploys = async (req, res) => {
    let { title, website, username, password } = req.body
    // console.log(req.body)

    // netlify credientials 
    let NETLIFY_TOKEN = process.env.NETLIFY_TOKEN
    let NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID
    // console.log(process.env.NETLIFY_TOKEN)

    // generate unique folder name 
    let cardid = crypto.randomBytes(4).toString('hex')
    let folderpathinzip = `cards/${cardid}`

    // Create HTML Content
    let html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        * {
            padding: 0;
            margin: 0;
            font-family: sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
            align-items: center;
            height: 100vh;
            padding: 1rem;
            background-image: linear-gradient(to bottom right,
                    #e0f2fe,
                    /* sky-100 */
                    #e0e7ff,
                    /* indigo-100 */
                    #f3e8ff
                    /* purple-100 */
                );
        }

        .card {

            background-color: rgba(255, 255, 255, 0.7);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            border-radius: 1rem;
            min-width: 30vw;
            font-size: medium;
            height: fit-content;
        }

        @media screen and (max-width:700px) {
            .card {
                width: 80%;
                font-size: medium;
            }

            h1 {
                font-size: 1.2rem;
            }
        }

        strong {
            margin-right: 1rem;
        }

        h2 {
            text-align: center;
        }

        .flex {
            display: flex;
        }

        .justify-bet {
            justify-content: space-between;
        }

        .gap {
            gap:0.5rem;
            overflow-wrap: anywhere;
            
        }
        .font{
            font-size: 0.7rem;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1> 🔐 Password Manager</h1>
        <div class="card">
            <h2>${title}</h2>
            <div class="flex justify-bet">
                <strong>Website : </strong> <a href="#"> ${website} </a>
            </div>
            <div class="flex justify-bet">
                <strong>Username :</strong>
                <div class="flex gap">
                    <span id="user" class='font'>✱✱✱✱✱</span>
                    <i id="usernameicon" class="fa-solid fa-eye" onclick="toggleusername()"></i>
                </div>
            </div>

            <div class="flex justify-bet">
                <strong>Password :</strong>
                <div class="flex gap">
                    <span id="pass" class='font'>✱✱✱✱✱</span>
                    <i id="passwordicon" class="fa-solid fa-eye" onclick="togglepassword()"></i>
                </div>
            </div>
        </div>
    </div>
</body>
<script>

 
    let togglepassword = () => {
        let el = document.getElementById('pass')
        el.className = (el.innerHTML == ${password})?  'font':''
        let icon = document.getElementById('passwordicon')
        icon.className = (icon.className == 'fa-solid fa-eye')? 'fa-solid fa-eye-slash': 'fa-solid fa-eye'
        let initialpassword =  '&#10033;'.repeat(Math.min(el.innerHTML.length, 8)) 
        el.innerHTML = (el.innerHTML !== '${password}') ? ${password} : '✱✱✱✱✱'
    }
    let toggleusername = () => {
        let user = document.getElementById('user')
        user.className = (user.innerHTML == '${username}')? 'font':''
        let icon = document.getElementById('usernameicon')
        icon.className = (icon.className == 'fa-solid fa-eye')? 'fa-solid fa-eye-slash': 'fa-solid fa-eye'
        user.innerHTML = (user.innerHTML !== '${username}') ? '${username}':'✱✱✱✱✱'
    }
</script>

</html>`

    // Create _redirects File Content
    let redirects = `/cards/*  /blog/:splat/index.html 200 \n`


    // Create ZIP Archive In Memory 
    let chunks = []
    try {
        let archive = archiver('zip', { zlib: { level: 9 } })

        archive.on('data', chunk => chunks.push(chunk))
        archive.on('error', err => console.log(err))

        archive.append(html, { name: `${folderpathinzip}/index.html` })
        archive.append(redirects, { name: '_redirects' })
        archive.finalize()

        await new Promise((resolve, reject) => {
            archive.on('close', resolve)
            archive.on('error', reject)
        })
        // zipbuffer 
        let zipBuffer = Buffer.concat(chunks)

        // netlify response 
        let netlifyresponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${NETLIFY_TOKEN}`,
                'Content-type': 'application/zip'
            },
            body: zipBuffer
        })
        // console.log(netlifyresponse)

        if (!netlifyresponse.ok) {
            res.send({
                error: 'Link is not loaded!',
            })
            return
        }

        let data = await netlifyresponse.json()
        // console.log(data.deploy_ssl_url)

        let finalurl = `${data.deploy_ssl_url}/${folderpathinzip}/`

        res.send({
            msg: 'working...',
            url: finalurl
        })

    } catch (error) {
        res.send({
            error
        })
    }


}

let existuser = async (req, res) => {
    let { username, email } = req.body
    let existuser = await usermodel.findOne({ username: username })
    let existemail = await usermodel.find({ email: email })

    if (existuser) {
        res.send({
            usererror: 'user already exist!'
        })
        return
    }
    if (existemail.length > 0) {
        res.send({
            emailerror: 'Email already exist!'
        })
    }
    res.send({
        msg: 'username available'
    })
}

let subscription = async (req, res) => {
    let { priceid, objectid } = req.body

    let user = await usermodel.findOne({ _id: objectid })
    // console.log(user)

    if (user.subscription == true) {
        res.send({
            msg: 'Your account has been already upgraded!'
        })
        return
    }

    try {
        let session = await stripe.checkout.sessions.create({

            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceid,
                    quantity: 1,

                },

            ],
            billing_address_collection: 'required',

            subscription_data: {
                trial_period_days: 7
            },


            success_url: `${process.env.SUCCESS_URL}`,
            cancel_url: `${process.env.CANCEL_URL}`,
            client_reference_id: objectid
        })

        res.send({
            sessionid: session.id,
        })
    } catch (error) {
        res.send({
            error
        })
    }


    // console.log(session)

}

let getsubscription = async (req, res) => {
    try {
        let session_id = req.query.session_id
        let session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['subscription']
        })

        let subscription = session.subscription

        let subscriptiondetails = {
            customerid: subscription.customer,
            subscriptionid: subscription.id,
            priceid: subscription.items.data[0].price.id,
            status: subscription.status,
            currentperiodstart: new Date(subscription.items.data[0].current_period_start * 1000),
            currentperiodend: new Date(subscription.items.data[0].current_period_end * 1000),
            trialstart: new Date(subscription.trial_start * 1000),
            trialend: new Date(subscription.trial_end * 1000),
            cancelAtperiodend: subscription.cancel_at_period_end,
            cancelAt: new Date(subscription.cancel_at * 1000)
        }

        let details = await new subscriptionModel(subscriptiondetails)
        let saved = await details.save()
        // console.log(session)
        if (saved) {
            let update = await usermodel.updateOne({ _id: session.client_reference_id }, { subscription: true })
        }
        res.send({
            msg: 'Upgraded Successfully!',
        })
    } catch (error) {
        res.send({ error })
    }

}

let authenticateuser = async (req, res) => {
    try {
        let { username, masterpassword } = req.body

        let obj = joi.object({
            username: joi.string().trim().replace(/\s+/g, '').required(),
            masterpassword: joi.string().trim().replace(/\s+/g, '').required()
        })

        const { value, error } = obj.validate({
            username,
            masterpassword
        })

        if (error) {
            res.send({
                msg: 'joi error',
                error
            })
            return
        }
        let founduser = await usermodel.findOne({ username: value.username })
        if (!founduser) {

            if (username && masterpassword && founduser == null) {
                res.send({
                    error: 'User not exist!'
                })
                return
            }
        }

        let originalpassword = await bcrypt.compare(value.masterpassword, founduser.masterpassword)
        if (originalpassword !== true) {
            res.send({
                error: 'Please enter valid masterpassword!'
            })
            return

        }
        else {
            res.send({
                msg: 'user found!',
                user: founduser,
            })
        }

    } catch (error) {
        res.send({
            msg: 'another error',
            error,
        })
        console.log(error)
    }

}

let getuser = async (req, res) => {
    let { objectid } = req.body
    // console.log(req.body)
    try {
        let userdetails = await usermodel.findOne({ _id: objectid })
        res.send({
            userdetails
        })
    } catch (error) {
        res.send({
            error
        })
    }
}
let deleteaccount = async (req, res) => {
    let { objectid } = req.body
    try {
        let user = await usermodel.findOne({ _id: objectid })
        let userdetails = await usermodel.deleteOne({ _id: objectid })
        res.send({
            msg: 'Account deleted!',
            userdetails,
            user

        })
    } catch (error) {
        res.send({
            error
        })
    }

}

let updateprofile = async (req, res) => {
    let { objectid, imgurl } = req.body
    // console.log(req.body)
    try {
        await usermodel.updateOne({ _id: objectid }, { profile: imgurl })
        res.send({
            msg: 'Profile updated!'
        })
    } catch (error) {
        res.send({ error })
    }

}

let contact = async (req, res) => {
    const { name, email, message } = req.body
    let obj = {
        name, email, message
    }

    try {
        let savedetails = await new contactModel(obj)
        await savedetails.save()
        res.send({
            msg: 'Thanks for reaching out! We’ll get back to you soon.'
        })
    } catch (error) {
        res.send({
            error
        })
    }

}



module.exports = {
    insert,
    data,
    adduser,
    finduser,
    deploys,
    existuser,
    subscription,
    getsubscription,
    authenticateuser,
    getuser,
    deleteaccount,
    updateprofile,
    contact
}