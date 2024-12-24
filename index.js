import register from './service/register/index.js';
import buildResponse from './utils/index.js';
import login from './service/login/index.js';
import verify from './service/verify/index.js';
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';


export const handler = async (event) => {
    let response;

    switch(true){
        case event.httpMethod === 'GET' &&  event.path === healthPath:
            const healthBody = JSON.parse(event.body);
            response = buildResponse(200, '')
            break;
        case event.httpMethod === 'POST' &&  event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await register(registerBody)
            break;
        case event.httpMethod === 'POST' &&  event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await login(loginBody)
            break;
        case event.httpMethod === 'POST' &&  event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verify(verifyBody)
            break;
        default:
            response = buildResponse(404, '404 not found.')
        
  }
 
  return response;
};



