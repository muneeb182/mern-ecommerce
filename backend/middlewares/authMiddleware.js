// For assign the admin role
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';
// authentication
const authentication = asyncHandler( async(req ,res , next) =>{
    let token;

    // Read jwt for the 'jwt' cookie
    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token ,'sdjdsjdsjjddsjsdjdsjsdjsdj');
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized,token failed")
        }
    }
    else{
        res.status(401)
        throw new Error("Not Authorized , no token")

    }
})

const AuthorizedAdmin = (req ,res , next) =>{
        if(req.user && req.user.isAdmin){
            next();
        }
        else{
            res.status(400).send('Not authorized as an admin');
        }


}

export {authentication , AuthorizedAdmin}