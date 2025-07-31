import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../admin_assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700"
              key={order._id}
            >
              {/* Parcel Icon */}
              <img src={assets.parcel_icon} alt="parcel" className="w-12" />

              {/* Order Details */}
              <div>
                <div>
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.name} × {item.quantity} <span>({item.size})</span>
                      {idx !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className="font-semibold mt-2">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{' '}
                    {order.address.country}
                  </p>
                  <p>{order.address.pincode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>

              {/* Order Info */}
              <div>
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? '✅ Done' : '⏳ Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              {/* Amount */}
              <p className="font-semibold text-green-600">
                {currency}
                {order.amount}
              </p>

              {/* Status Update Dropdown */}
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="shipped">Shipped</option>
                <option value="delivery complete">Delivery Complete</option>
                <option value="Order cancelled">Order Cancelled</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
