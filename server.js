const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./typeDefs')
const resolvers= require('./resolvers')
const { findOrCreacteUser } = require('./controllers/userController')

mongoose
.connect(process.env.MONGO_URI,{
    useNewUrlParser : true })
    .then(() => console.log('DB connected'))
    .catch(e => console.log(e))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken = null
        let currentUser = null
        try {
            authToken = req.headers.autorization
            if(authToken){
               currentUser = await findOrCreacteUser(authToken)

                // find or crete user 
            }
        } catch(e) {
            console.log(`Unable to authenticate user with token ${authToken}`)
        }
        return currentUser    
    }
})

server.listen().then(({ url }) => {
    console.log(`Server lostening on ${url}`)
})