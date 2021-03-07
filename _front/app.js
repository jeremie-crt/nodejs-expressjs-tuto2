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

app.get('/', (req, res) => { res.redirect('/members') })

//Page List all members
app.get('/members', (req, res) => {
    apiCall(req.query.max ? '/members?max=' + req.query.max : '/members/','get', {}, res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
})

//Page profil member
app.get('/members/:id', (req, res) => {
    apiCall('/members/' + req.params.id,'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result
        })
    })
})

//Page profil member edition
app.get('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id,'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
})

//Deal data editon
app.post('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'put',  {
        name: req.body.name,
        grade: req.body.grade
    }, res, () => {
       res.redirect('/members')
    })
})

//Delete a member
app.post('/delete', (req, res) => {
    apiCall('/members/' + req.body.id,'delete', {}, res, () => {
        res.redirect('/members')
    })
})

//View for insert a new member
app.get('/insert', (req, res) => {
    res.render('insert.twig')})

//Deal data insert
app.post('/insert', (req, res) => {
    apiCall('/members', 'post',  {
        name: req.body.name,
        grade: req.body.grade
    }, res, () => {
        res.redirect('/members')
    })
})

//Launch app
app.listen(port,  () => console.log('App started on port ' + port))

function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}

function apiCall(url, method, data, res, callback) {

    fetch({
        method: method,
        url: url,
        data: data
    })
        .then((response) => {
        if(response.data.status.toLowerCase() == 'success') {
            callback(response.data.result)
        } else {
            renderError(res, response.data.message)
        }
    })
        .catch((err) => renderError(res, err.message))
}