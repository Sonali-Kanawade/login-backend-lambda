import jwt from 'jsonwebtoken';

function generateToken(userInfo){
    if(!userInfo){
        return null;
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

export default generateToken;