import AWS from 'aws-sdk';
import buildResponse from '../../utils/index.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/auth.js';
AWS.config.update({
    region: 'us-east-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';

const login = async (user) => {
    const username = user.username;
    const password = user.password;

    if(!user || !password || !username){
        return buildResponse(401, {
            message: 'username and pasword are required.'
        })
    }

    const dynamoUser = await getUser(username);

    if(!dynamoUser || !dynamoUser.username){
        return buildResponse(403, {
            message: 'user dose not exist'
        })
    }

    if(!bcrypt.compareSync(password, dynamoUser.password)){
        return buildResponse(403, {
            message: 'password is incorrect'
        })
    }

    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }

    const token = generateToken(userInfo)
    const response = {
        user: userInfo,
        token: token
    }

    return buildResponse(200, response)
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

export default login;