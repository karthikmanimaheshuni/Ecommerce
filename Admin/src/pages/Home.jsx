import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        
        {/* Add Product Card */}
        <Link to="/addproduct" className="border p-6 rounded-lg shadow hover:shadow-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">➕ Add Product</h2>
          <p className="text-gray-600 mt-2">Add new products to your store</p>
        </Link>

        {/* Product List Card */}
        <Link to="/list" className="border p-6 rounded-lg shadow hover:shadow-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">📦 Product List</h2>
          <p className="text-gray-600 mt-2">View, edit & manage products</p>
        </Link>

        {/* Orders Card */}
        <Link to="/orders" className="border p-6 rounded-lg shadow hover:shadow-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">🧾 Orders</h2>
          <p className="text-gray-600 mt-2">Track & manage customer orders</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
