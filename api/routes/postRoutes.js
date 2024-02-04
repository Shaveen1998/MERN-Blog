import express from 'express'
import {createPost, editPost, deletePost} from '../controllers/postController.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create', verifyToken, createPost)

router.post('/edit', verifyToken, editPost)

router.post('/delete', verifyToken, deletePost)

export default router