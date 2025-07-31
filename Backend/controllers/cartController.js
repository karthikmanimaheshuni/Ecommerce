import userModel from "../models/userModel.js";

// ✅ Add to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, size } = req.body;

        if (!itemId || !size) {
            return res.json({ success: false, message: "Item ID and size required" });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        let cartData = user.cartData || {};
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        return res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("❌ addToCart Error:", error);
        return res.json({ success: false, message: error.message });
    }
};

// ✅ Update cart
export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, size, quantity } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        let cartData = user.cartData || {};
        if (!cartData[itemId]) return res.json({ success: false, message: "Item not in cart" });

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated" });
    } catch (error) {
        console.error("❌ updateCart Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Get user cart
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        return res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error("❌ getUserCart Error:", error);
        return res.json({ success: false, message: error.message });
    }
};
