import asyncHandler from '../Utils/asyncHandler.js';
import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';
import CustomError from '../Utils/CustomError.js'

const isLogined = asyncHandler(async(req, res, next) => {
    
    // Getting Token from User
    let token = req.cookies.jwt;

    if(!token){
        return next(new CustomError("Access Denied, Please Login Again", 403));
    }

    // Decoding the Token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_STRING);

    // Finding the User in Database according to Decoded Token
    const user = await User.findById(decodedToken.id);

    if(!user){
        return next(new CustomError("The user with this given token does not exist", 401));
    }
    
    req.user = user

    next();
});

export default isLogined;