import AWS from 'aws-sdk';
import buildResponse from '../../utils/index.js';
import bcrypt from 'bcryptjs';
AWS.config.update({
    region: 'us-east-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';


const register = async(userInfo) => {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;


    if(!name && !email && !username && !password){
        return buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username);

    if(dynamoUser && dynamoUser.username){
        return buildResponse(401, {
            message: 'username already exist in our database. Please choose any diffrent username.'
        })
    }

    const encryptPW = bcrypt.hashSync(password.trim(), 10)
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptPW
    }

    const saveUserResponse = await saveUser(user);

    if(!saveUserResponse){
        return buildResponse(503, {
            message: 'Server Error, Please try again.'
        })
    }

    return buildResponse(200, {username:username})
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key:{
            username:username
        }
    }

    return await dynamodb.get(params).promise().then((res)=>{
        return res.Item;
    }, (error) => {
        console.error('there is an error getting user: ', error)
    })
}

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }

    return await dynamodb.put(params).promise().then(() => {
        return true
    }, (error) => {
        console.error('there is an error saving user: ', error)
    })
    
}

export default register;