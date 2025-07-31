import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');

    const navigate = useNavigate();

    // ✅ Add to Cart
   const addToCart = async (itemId, size) => {
    if (!token) {
        toast.info("Please login to add items to cart");
        navigate('/login');
        return; // ✅ Stop here if no token
    }

    if (!size) {
        toast.error('Select product size');
        return;
    }

    // Update local state after successful API call
    try {
        const response = await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
            let cartData = JSON.parse(JSON.stringify(cartItems));
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
            setCartItems(cartData);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Failed to add to cart");
    }
};


    // ✅ Get User Cart from DB
    const getUserCart = async () => {
        if (!token) return;

        console.log("📦 Fetching user cart...");
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("✅ API Response (Get Cart):", response.data);

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching user cart:", error.message);
        }
    };

    // ✅ Cart Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                totalCount += cartItems[items][size] || 0;
            }
        }
        return totalCount;
    };

    // ✅ Update Quantity
    const updateQuantity = async (itemId, size, quantity) => {
        console.log("✏️ updateQuantity called", { itemId, size, quantity });

        if (!token) return;

        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, size, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("✅ API Response (Update Cart):", response.data);
            await getUserCart();
        } catch (error) {
            console.error("❌ Error in updateQuantity:", error.message);
            toast.error(error.message);
        }
    };

    // ✅ Cart Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find(product => product._id === items);
            if (!itemInfo) continue;
            for (const size in cartItems[items]) {
                totalAmount += itemInfo.price * cartItems[items][size];
            }
        }
        return totalAmount;
    };

    // ✅ Fetch Products
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.product);
            } else {
                toast.error(response.data.message || 'No products found');
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
            toast.error(error.message);
        }
    };

    // ✅ Logout
    const logoutUser = () => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        toast.info("Logged out successfully");
        navigate('/login');
    };
    

    // ✅ Load token on page load
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // ✅ Fetch data when token changes
    useEffect(() => {
        if (token) {
            getUserCart();
        }
    }, [token]);

    useEffect(() => {
        getProductsData();
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        logoutUser,
        setCartItems
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
