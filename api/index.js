import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './routes/userRoutes.js'
import authRoute from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import postRoute  from './routes/postRoutes.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(3000,()=>{
        console.log('Server running on port 3000 and database connected')
    })
})
.catch(err=>{
    console.log(err)
})

app.use('/api/user' , userRoute)
app.use('/api/post' , postRoute)
app.use('/api/auth' , authRoute)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message|| 'Internal Server error';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

