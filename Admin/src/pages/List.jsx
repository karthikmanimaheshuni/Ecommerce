import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import { currency } from '../App';

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token },
      });

      if (response.data.success && Array.isArray(response.data.product)) {
        setList(response.data.product);
      } else {
        setList([]);
        toast.error(response.data.message || 'No products found');
      }
    } catch (error) {
      console.log(error);
      setList([]);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <p className="mb-4 text-xl font-bold text-gray-800 border-b pb-3">All Products List</p>
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_80px] items-center py-3 px-4 border-b bg-gray-100 text-sm font-semibold text-gray-700 rounded-md">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p>Inventory</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product Rows */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_80px] items-center gap-3 py-3 px-4 bg-white border rounded-md shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <p className="truncate font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-600">{item.category}</p>
              <p className="font-semibold text-green-600">{currency}{item.price}</p>
              <p className={`font-bold ${item.inventory > 10 ? 'text-blue-600' : 'text-red-500'}`}>
                {item.inventory}
              </p>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-700 font-bold bg-red-100 hover:bg-red-200 rounded-md px-2 py-1 transition"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
