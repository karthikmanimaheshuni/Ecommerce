//placing order using cod
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { items, amount, address } = req.body;

    // ✅ Check inventory for all products before placing the order
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (!product) {
        return res.json({ success: false, message: `Product not found` });
      }
      if (product.inventory < item.quantity) {
        return res.json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.inventory}`,
        });
      }
    }

    // ✅ Deduct inventory for each item after validation
    for (const item of items) {
      await productModel.findByIdAndUpdate(item.itemId, {
        $inc: { inventory: -item.quantity },
      });
    }

    // ✅ Create order
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Clear the user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.json({ success: false, message: error.message });
  }
};

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
