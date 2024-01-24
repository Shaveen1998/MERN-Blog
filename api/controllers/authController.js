import User from '../models/userModel.js';
import bcrypt from 'bcrypt'
import { errorHandler } from '../utils/error.js';

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


