import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebHooks } from './controllers/webHooks.js'

const app = express()
await connectDB()

const PORT = process.env.PORT || 3000;

//Stripe webhooks
app.post('/api/stripe', express.raw({type:"application/json"}),stripeWebHooks)

//middlewares
app.use(cors())
app.use(express.json())

//routes
app.get('/',(req,res)=>res.send('Hola! you have created yout first GET method'))
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter)

app.listen(PORT,()=>{
    console.log('Listening on port ' + PORT)
})


