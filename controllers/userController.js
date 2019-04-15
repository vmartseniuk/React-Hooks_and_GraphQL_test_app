const User = require ('../models/User')

const { OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)


exports.findOrCreacteUser = async token => {
    // verity auth token
    const googleUser = await verifyAuthToken(token)
    // check if the user exists
    const user =  await checkIfUserExists(googleUser.email)
    // if user exist, return them; otherwise, create new user in db
    return user ? user : await createNewUser(googleUser)
}

const verifyAuthToken = async token =>{
    try{
        const ticket = await client.verifyIdToken({
            idToken : token ,
            audience: process.env.OAUTH_CLIENT_ID
        })
    return ticket.getPayload()
    }catch(e){
        console.error("Error =>", e)
    }
}

const checkIfUserExists = async email => {
    await User.findOne({email}).exec()
}
const createNewUser = async googleUser => {
    const { name, email, picture } = googleUser
    const user = { name, email, picture }
    return await (new User(user).save())
}