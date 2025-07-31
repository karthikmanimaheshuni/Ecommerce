import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/shopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const [method,setMethod] = useState('COD');
    const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,currency,products} = useContext(ShopContext);
    const [formData,setFormData] = useState({
        firstName :'',
        lastName : '',
        email :'',
        street : '',
        city :'',
        state : '',
        pincode:'',
        country :'',
        phone:''
    })

    const onChangeHandler = (e)=>{
        const name = e.target.name;
        const value = e.target.value;

        setFormData(data =>({...data,[name]:value}));

    }

   const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
        console.log("🛒 Placing Order...");

        // ✅ Step 1: Extract Items from Cart
        let orderItems = [];

       

        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    orderItems.push({
                        itemId: items,   // ✅ Only ID
                        size: item,
                        quantity: cartItems[items][item]
                    });
                }
            }
        }

  

        // ✅ Step 2: Validate Items
        if (orderItems.length === 0) {
            toast.error("Your cart is empty. Please add products before placing an order.");
            return;
        }

        // ✅ Step 3: Prepare Order Data
        let orderData = {
            address: formData,
            items: orderItems,
            amount: getCartAmount() + delivery_fee
        };

        console.log("📦 Final Order Data to send:", JSON.stringify(orderData, null, 2));

        // ✅ Step 4: Check if user is logged in
        if (!token) {
            toast.error("You need to log in before placing an order.");
            navigate("/login");
            return;
        }

        // ✅ Step 5: API Call
        switch (method) {
            case 'COD': {
                const response = await axios.post(
                    `${backendUrl}/api/order/place`,
                    orderData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("✅ API Response:", response.data);

                if (response.data.success) {
                    toast.success("Order placed successfully!");
                    setCartItems({}); // ✅ Clear Cart
                    navigate('/orders');
                } else {
                    toast.error(response.data.message || "Failed to place order");
                }
                break;
            }

            // ✅ Add Razorpay/Stripe/UPI handling here later
            default:
                toast.error("Please select a payment method");
                break;
        }
    } catch (error) {
        console.error("❌ Error placing order:", error);
        toast.error(error.message || "Something went wrong while placing the order");
    }
};


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-12 min-h-[60vh] border-t'>
        {/** ---------left side --------- */}
        <div className='flex flex-col gap-4 w-full sm:w-1/2 max-w-[480px]'>
            <div className='text-xl sm:text-2xl my-3'>
                <Title text1={'Delivery'} text2={'Information'}/>

            </div>
            <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="name" placeholder='first name' className='border border-gray-200 rounded py-1.5 px-3.5 w-full  '   />
                <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="name" placeholder='last name' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />

            </div>
            <input required onChange={onChangeHandler} name='email' value={formData.email}  type="email" placeholder='Email Id' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />
            <input required onChange={onChangeHandler} name='street' value={formData.street}  type="text" placeholder='Street' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />
             <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='city' value={formData.city}  type="name" placeholder='city' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />
                <input required onChange={onChangeHandler} name='state' value={formData.state}  type="name" placeholder='state' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />

            </div>
             <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='pincode' value={formData.pincode}  type="number" placeholder='Pincode' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />
                <input required onChange={onChangeHandler} name='country' value={formData.country}  type="text" placeholder='country' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />

            </div>
             <input required onChange={onChangeHandler} name='phone' value={formData.phone}  type="number" placeholder='Phone Number' className='border border-gray-200 rounded py-1.5 px-3.5 w-full '  />

        </div>

        {/** -----------right side----------- */}
        <div className='flex flex-col w-full sm:w-1/2 max-w-[480px] mt-8'>
            <div className='mt-8 min-w-[320px]'>
                <CartTotal/>

            </div>

            <div className='mt-12'>
                <Title text1={'Payment'} text2={'Method'}/>
                {/** ----payment method selection ----- */}
                
  
                <div className="flex flex-wrap gap-3 lg:flex-row mt-4">
                    {/* Stripe */}
                    <div
                        onClick={() => setMethod('stripe')}
                        className={`flex items-center justify-center gap-2 border rounded-md p-2 cursor-pointer w-[140px] h-[60px] ${
                            method === 'stripe' ? 'border-green-500' : ''
                        }`}
                        >
                        <p className={`w-4 h-4 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                        <img
                            className="h-6 w-auto max-w-[80px] object-contain"
                            src={assets.stripe_logo}
                            alt="Stripe"
                        />
                    </div>

                    {/* Razorpay */}
                    <div
                        onClick={() => setMethod('razorpay')}
                        className={`flex items-center justify-center gap-2 border rounded-md p-2 cursor-pointer w-[140px] h-[60px] ${
                            method === 'razorpay' ? 'border-green-500' : ''
                        }`}
                        >
                        <p className={`w-4 h-4 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                        <img
                            className="h-6 w-auto max-w-[80px] object-contain"
                            src={assets.razorpay_logo}
                            alt="Razorpay"
                        />
                    </div>

                    {/* Cash on Delivery */}
                    <div
                        onClick={() => setMethod('COD')}
                        className={`flex items-center justify-center gap-2 border rounded-md p-2 cursor-pointer w-[140px] h-[60px] ${
                            method === 'COD' ? 'border-green-500' : ''
                        }`}
                        >
                        <p className={`w-4 h-4 border rounded-full ${method === 'COD' ? 'bg-green-400' : ''}`}></p>
                        <p className="text-gray-600 text-sm font-medium text-center">Cash on Delivery</p>
                    </div>

                    {/* UPI */}
                    <div
                        onClick={() => setMethod('UPI')}
                        className={`flex items-center justify-center gap-2 border rounded-md p-2 cursor-pointer w-[140px] h-[60px] ${
                            method === 'UPI' ? 'border-green-500' : ''
                        }`}
                        >
                        <p className={`w-4 h-4 border rounded-full ${method === 'UPI' ? 'bg-green-400' : ''}`}></p>
                        <p className="text-gray-600 text-sm font-medium text-center">UPI</p>
                    </div>
                </div>

                <div className='w-full text-end mt-8'>
                    <button type='submit'  className='bg-black text-white px-16 py-5 text-sm cursor-pointer'>Place Order</button>

                </div>
            </div>

                     
                    
        </div>
                   



                     
    </form>

       
   
  )
}

export default PlaceOrder
