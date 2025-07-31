import express from 'express';
import { placeOrder,placeOrderRazorpay,placeOrderStripe,userOrders,updateStatus,allOrders } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// created multiple endpoints 
//admin feature 
orderRouter.post('/list',adminAuth,allOrders);
orderRouter.post('/status',adminAuth,updateStatus);

//payment feature 
orderRouter.post('/place',authUser,placeOrder);
orderRouter.post('/stripe',authUser,placeOrderStripe);
orderRouter.post('/razorpay',authUser,placeOrderRazorpay);

//user feature 
orderRouter.post('/user',authUser,userOrders);



export default orderRouter;