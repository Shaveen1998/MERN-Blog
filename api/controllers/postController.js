import { errorHandler } from "../utils/error.js"
import Post from "../models/postModel.js"

export const createPost = async (req,res,next)=>{

    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }

    if(!(req.body.title || req.body.content)){
        return next(errorHandler(403, 'Please provide all required fields'))
    }

    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    })

    try{
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch(err){
        next(err)
    }
}

export const editPost = (req,res,next)=>{

}

export const deletePost = (req,res,next)=>{
    
}