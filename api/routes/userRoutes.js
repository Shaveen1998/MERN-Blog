import express from 'express'
import {updateUser, deleteUser, signoutUser} from '../controllers/userController.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router()

router.get('/test',(req,res)=>{
    res.json({msg:"testing api"})
})

router.put('/update/:userId', verifyToken , updateUser)

router.delete('/delete/:id', verifyToken, deleteUser )

router.post('/signout', signoutUser )



export default router