import buildResponse  from "../../utils/index.js";
import jwt from "jsonwebtoken";

const verify = async(requestBody) => {
    if(!requestBody.user || !requestBody.user.username || !requestBody.token){
        return buildResponse(401, {
            verified: false,
            message: 'incorrect request body'
        })
    }

    const user = requestBody.user;
    const token = requestBody.token;

    const verification = verifyToken(user.username, token);

    if(!verification.verified){
        return buildResponse(401, verification)
    }

    return buildResponse(200, {
        verified: true,
        message: 'Success',
        user: user,
        token: token
    })
}

function verifyToken(username, token){
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) =>{
        if(error){
            return {
                verified: false,
                message: 'invalid token'
            }
        }

        if(response.username !== username) {
            return {
                verified: false,
                message: 'invalid user'
            }
        }

        return {
            verified: true,
            message: 'verified'
        }
    })
}

export default verify;