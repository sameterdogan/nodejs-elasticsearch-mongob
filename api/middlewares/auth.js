import jwt from 'jsonwebtoken'
import UserModel from "../models/user.js"
import CustomError from '../util/CustomError.js'
import { contentToken, headersCheckToken } from '../util/jwt/token.js'

export const isLogin = async (req, res, next) => {
    try {
        if (!headersCheckToken(req))
            return next(new CustomError('Buraya erişim iznin yok !', 401))
        const token = contentToken(req)
        const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await UserModel.findById(verifiedToken._id)
        if(!req.user)return next(new CustomError('Oturumun süresi dolmuş !', 401))


        next()

    } catch (err) {
        console.log(err)
        next(new CustomError('Oturumun süresi dolmuş.', 403))
    }
}


export const isSuspend=async(req,res,next)=>{
    req.user.suspend===false?next():next(new CustomError("kullanıcının hesabı askıya alınmış.",403))

}

export const isAdmin = async (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin')
        return next(
            new CustomError(
                'You are not authorized to access this route !',
                401
            )
        )
    next()
}
