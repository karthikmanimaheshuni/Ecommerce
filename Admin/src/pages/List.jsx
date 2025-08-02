import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import {toast} from 'react-toastify'
import axios from 'axios';
import { currency } from '../App';

const List = ({token}) => {
  const [list,setList] = useState([]);

 const fetchList = async () => {
  try {
    const response = await axios.get(backendUrl + '/api/product/list', {
      headers: { token },
    });
    console.log('API Response:', response.data);

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

const removeProduct =async(id)=>{
      try {
        
        const response = await axios.post(backendUrl+'/api/product/remove',{id},{headers:{token}});
        if(response.data.success){
            toast.success(response.data.message);
            await fetchList()
        }else{
            toast.error(response.data.message);
        }

      } catch (error) {
          console.log(error);
          toast.error(error.message);
        
      }
}


  useEffect(()=>{
    fetchList();
  },[]);


  return (
   
  <div>
    <p className="mb-2 text-lg font-semibold">All Products List</p>
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm font-bold">
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
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border-b text-sm"
          >
            <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-cover" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p>{item.inventory}</p>
            <button onClick={()=>removeProduct(item._id)} className="text-red-500 cursor-pointer font-bold">X</button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  </div>
);

}

export default List
