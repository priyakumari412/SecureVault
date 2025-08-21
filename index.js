const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { router } = require('./routes/allroutes')
require('dotenv').config()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>404 - Page Not Found</title>
      <style>
        body {
          background-color: #f8f9fa;
          color: #343a40;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        h1 {
          font-size: 6rem;
          margin-bottom: 0;
          color: #dc3545; /* Bootstrap's red */
        }
        p {
          font-size: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 2rem;
        }
        .container {
          text-align: center;
          border: 2px solid #dc3545;
          padding: 2rem 3rem;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 8px 16px rgba(220, 53, 69, 0.2);
          max-width: 600px;
        }
        a {
          display: inline-block;
          text-decoration: none;
          background-color: #dc3545;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        a:hover {
          background-color: #b02a37;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>The requested URL <strong>${req.originalUrl}</strong> was not found on this server.</p>
        <a href="/">Go Back Home</a>
      </div>
    </body>
    </html>
  `);
});


mongoose.connect(process.env.dburl).then(() => {
    console.log('db connected')
    app.listen(process.env.port, () => {
        console.log('http://localhost:3005/')
    })
})

app.use('/user', router)


