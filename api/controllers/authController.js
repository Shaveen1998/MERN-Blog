import User from '../models/userModel.js';
import bcrypt from 'bcrypt'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req,res, next)=>{
    const {username,email, password} = req.body
    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400,'Empty fields'))
      }

      const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    try{
        await newUser.save();
        res.json({msg:'signup successful'})
    }catch(error){
        next(error)
    }
}



export const signin = async(req,res,next)=>{
    const {email, password} = req.body;

    if (
        !email ||
        !password ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400,'Empty fields'))
      }

    
try{
    const validUser = await User.findOne({email})
    if(!validUser){
        return next(errorHandler(404,'User not found'))
    }

    const validPassword = bcrypt.compareSync(password,validUser.password)

    if(!validPassword){
        return next(errorHandler(404, 'Password does not match'))
    }

    const token  = jwt.sign(
        {id: validUser._id,}, 
        process.env.JWT_SECRET,
    )

    res.status(200).cookie('access_token', token, {
        httpOnly:true
    }).json(validUser)
 
}catch(err){
    next(err)
}
    
}


