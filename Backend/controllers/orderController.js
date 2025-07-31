//placing order using cod
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

export const placeOrder = async(req,res)=>{

    try {
        const userId = req.user.id;
        const {items ,amount,address} = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:'COD',
            payment:false,
            date :Date.now()

        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}});//clear the cart 

        res.json({success:true,message:"order placed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }

}

//using stripe
export const placeOrderStripe = async(req,res)=>{

}

//using Razorpay
export const placeOrderRazorpay = async(req,res)=>{

}


//all orders data for admin panel 

export const allOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,orders})
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ success: false, message: "Server error" });
      
    }

}

//user orders for frontend 

export const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.json({ success: false, message: error.message });
  }
};


//udpade order status from Admin panel 
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
