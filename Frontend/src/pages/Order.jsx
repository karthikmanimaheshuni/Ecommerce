import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import axios from "axios";

const Order = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [openTrackIndex, setOpenTrackIndex] = useState(null); // Track which order's progress is open

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const allOrdersItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const product = products.find((p) => p._id === item.itemId);

            allOrdersItems.push({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              name: product?.name || "Unknown Product",
              price: product?.price || 0,
              image: product?.image || [],
            });
          });
        });

        setOrderData(allOrdersItems.reverse());
      }
    } catch (error) {
      console.error("❌ Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, products]);

  // Helper to determine step index
  const statusSteps = ["Ordered", "Packed", "Shipped", "Delivered"];

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <div className="border-t pt-16 px-4 md:px-8">
      <div className="text-2xl mb-6">
        <Title text1="My" text2="Orders" />
      </div>

      <div>
        {orderData.length === 0 ? (
          <p className="text-gray-500 mt-8 text-center">
            You have no orders yet.
          </p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left Section */}
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 rounded-md border"
                  src={item.image?.[0] || "/placeholder.png"}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-500">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={loadOrderData}
                  className="border px-5 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100"
                >
                  Track Order
                </button>
              </div>

            
           
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
