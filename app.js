const config = require('./assets/config.json')
const {success, error, checkAndChange} = require('./assets/functions')

const express = require('express')

const bodyParser = require('body-parser')
const morgan = require('morgan')('dev')

const mysql = require('promise-mysql')

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password

}).then((db) => {

    console.log('Connection database as id :' + db.threadId);

    const app = express()

    //gives info about the request url
    app.use(morgan)

    //Parse the data
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

    let membersRouter = express.Router()
    let MembersClass = require('./assets/class/members.class')(db, config)

    membersRouter.route('/:id')
        //Get one element member
        .get(async (req, res) => {
            let member = await MembersClass.getById(req.params.id)
            res.json(checkAndChange(member))
        })

        //Update one element member
        .put(async (req, res) => {
            let updateMember = await MembersClass.update(req.params.id, req.body.name)
            res.json(checkAndChange(updateMember))
        })

        //Delete one element member
        .delete(async (req, res) => {
            let deleteMember = await MembersClass.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    membersRouter.route('/')
        //Get all members
        .get(async (req, res) => {
            let allMembers = await MembersClass.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        //Create one element member
        .post(async (req, res) => {
            let addMember = await MembersClass.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

    //Call members router manager
    app.use(config.rootAPI + 'members', membersRouter)

    //Opens the server
    app.listen(config.port, () => console.log(`Example of app listening at http://localhost:${config.port}`))


}).catch((err) => {
    console.log('Error while connecting to database !')
    console.error(err.message)
})


function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id === parseInt(id)) {
            return i
        }
    }
    return 'Wrong Id'
}

function createId() {
    return members[members.length - 1].id + 1
}