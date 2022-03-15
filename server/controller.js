const axios = require('axios')

users = []
let globalId = 7

module.exports = {
    seed: async (req, res) => {
        axios.get('https://reqres.in/api/users')
            .then(apires => {
                // console.log(apires.data.data)
                users = [...apires.data.data]
                res.status(200).send(users)
                return
            })
            .catch(err => {
                console.log(err)
            })


    },
    getAllUsers: async (req, res) => {
        console.log('get all hit')
    },
    getOneUser: async(req, res) => {
        // console.log(req.params)
        let {user_id: id} = req.params
        // console.log(id)
        let index = users.findIndex(user => +user.id === +id)
        // console.log('index is ' + index)
        res.status(200).send(users[index])

    },
    addUser: async (req, res) => {
        console.log('add hit')
        let {email, first_name, last_name, avatar} = req.body

        let newUser = {
            user_id: globalId,
            email,
            first_name,
            last_name,
            avatar
        }

        users.push(newUser)
        globalId++
        console.log(users)
        res.status(200).send(users)

    },
    editUser: async (req, res) => {
        console.log('edit hit')
        let {user_id} = req.params
        let {first_name, last_name, email, avatar} = req.body
        let newBody = {
            id: +user_id, 
            email, 
            first_name,
            last_name, 
            avatar
        }
        console.log(newBody.id)
        let index = users.findIndex(user => +user.id === +user_id)
        users.splice(+index, 1, newBody)
        res.status(200).send(users)

    },
    deleteUser: async (req, res) => {
        let {user_id: id} = req.params
        let index = users.findIndex(user => +user.id === +id)
        users.splice(+index, 1)
        res.status(200).send(users)
    }
}