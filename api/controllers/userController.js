import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import User from '../models/userModel.js';

export const updateUser = async (req, res, next) => {
    console.log(req.user)
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, 'Username must be between 7 and 20 characters')
        );
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, 'Username can only contain letters and numbers')
        );
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async(req,res,next)=>{
    const {userId} = req.paramas
    if(req.user.id !== userId){
      return next(errorHandler(401, 'You are not allowed to delete this user'))
    }
    try{
      const user = User.findByIdAndDelete(userId)
      res.status(200).json('User has been deleted')
    }
      catch(err){
        next(err)
      }
   
  }

  export const signoutUser = async(re,res,next)=>{
    const {userId} = req.params
    if(req.user.id !== userId){
      return next(errorHandler(401, 'You are not allowed to signout'))
    }

    try{
      res.clearCookie('access_token').status(200).json('User had been signed out')
      
    }catch(error){
      next(error.message)
    }
  }