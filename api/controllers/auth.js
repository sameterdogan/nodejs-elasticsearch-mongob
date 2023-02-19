import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import CustomError from '../util/CustomError.js';



export const register = async (req, res, next) => {
    try {
        if(await UserModel.count({email:req.body.email})>0){
            return next(new CustomError("Bu E posta ile daha önce kayıt oluşturulmuş!",400));
        }

        const user= new UserModel({...req.body})
        if(user){
            await user.save()
        }

        res.status(200).json({
            success: true,
            message: `Hesap Başarıyla Oluşturuldu.`,
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
};

export const login = async (req, res, next) => {
    try{
        const user = await UserModel.findOne({email: req.body.email},)
        if(!user) return next(new CustomError("e-postaya  ait kullanıcı bulunamadı.",400))
        if(!await bcrypt.compare(req.body.password,user.password)){
            return res.status(400).json({
                success:false ,
                message:"Şifre hatalı,kontrol edin."
            })
        }
        user.password=undefined
        const token =await jwt.sign({_id:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        })
        res.status(200).json({
            success:true,
            message:"Giriş işlemi başarılı",
            user,
            token
        })
    }catch (err){
        console.log(err)
        next(err)
    }

}

export const me = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user,
    })
}
