import express from 'express'
import cors from 'cors'
import 'dotenv/config'
//import { connect } from 'mongoose';
import connectdb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


//text app config 

const app = express();


const port = process.env.PORT || 3000 ;

connectdb();
connectCloudinary();



//middlewares 

app.use(express.json())
app.use(cors());//now we can access the backend from any ip 

//api endpoints

app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);

app.get('/', (req,res)=>{
        res.send("Api working ")
})

app.listen(port,()=>console.log("server started on port :"+ port))