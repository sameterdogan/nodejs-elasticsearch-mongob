import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        surname:{
            type: String,
            trim: true,
        },
        password:{
            type:String,
            trim:true
        },
        email: {
            type: String,
            trim: true,
        },
        profileImage:{
            normal: {type: String,default:"profile/thumbnail/default.svg"},
            thumbnail: {type: String,default:"profile/normal/default.svg"}
        },
        slugName: {
            type: String,
        },

    },
    {
        timestamps: true,
    },
)

UserSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next()
    try{

        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await  bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }catch (err){
        next(err)
    }

})




export default mongoose.model('User', UserSchema)
