const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')('dev')
const twig = require('twig')
const axios = require('axios')

const app = express()
const port = 3400
const fetch = axios.create({
    baseURL: 'http://localhost:3000/api/v1'
})


//Middlewares
app.use(morgan) //gives info about the request url
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing

app.get('/', (req, res) => {
    res.render('index.twig', {

    })
})
app.get('/members', (req, res) => {

    fetch.get('/members')
        .then((response) => {
            if(response.data.status.toLowerCase() == 'success') {
                res.render('members.twig', {
                    members: response.data.result
                })

            } else {
                renderError(res, response.data.message)
            }
        })
        .catch((err) => renderError(res, err.message))
})

//Launch app
app.listen(port,  () => console.log('App started on port ' + port))

function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}