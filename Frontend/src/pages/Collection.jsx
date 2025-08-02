import React, { useContext,useEffect,useState } from 'react'
import { ShopContext } from '../context/shopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItems from '../components/ProductItems';

const Collection = () => {

  const { products, search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] =  useState(true);
  const [filterProduct,setFilterProduct] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent');

  const toggleCategory = (e) =>{
     if(category.includes(e.target.value)){
        setCategory(prev=>prev.filter(item => item != e.target.value));
     }else{
        setCategory(prev => [...prev,e.target.value]);
     }
  }

  const toggleSubCategory = (e) =>{
     if(subCategory.includes(e.target.value)){
        setSubCategory(prev=>prev.filter(item => item != e.target.value));
     }else{
        setSubCategory(prev => [...prev,e.target.value]);
     }
  }

  const applyFilter = ()=>{

      let productsCopy = products.slice();

      if(showSearch && search){
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
      }

      if(category.length > 0){
          productsCopy = productsCopy.filter(item => category.includes(item.category));
      }
      if(subCategory.length > 0){
          productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
      }
      setFilterProduct(productsCopy);
  }

  const sortProduct = () =>{
        let filterProductCopy = filterProduct.slice();

        switch(sortType){
            case 'low-high':
              setFilterProduct(filterProductCopy.sort((a,b)=>( a.price-b.price )));
              break;
            case 'high-low':
              setFilterProduct(filterProductCopy.sort((a,b)=>( b.price-a.price )));
              break;
            default:
              applyFilter();
              break;
        }
  }
  

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products]);
 
  useEffect(()=>(
    sortProduct()
  ),[sortType]);
 
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm :gap-10 pt-10 border-t'>

      {/*  filter options */}

        <div className='min-w-60'>
          <p  onClick={()=>setShowFilter(!showFilter)}className='my-2 flex item-center text-xl cursor-pointer gap-2 '>
              Filters
              <img className={`h-3  sm:hidden ${showFilter ? 'rotate-0' :''}`} src={assets.dropdown} atl="dropdown"/>
          </p>
          {/** Category filter  */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '': 'hidden'} sm:block`}>
                  <p className='mb-3 text-sm font-medium'> Categoies</p>
                  <div className='flexflex-col gap-2 text-sm font-light text-gray-700'>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Men'} onChange={toggleCategory}/>Men
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Women'} onChange={toggleCategory}/>Women
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Kids'} onChange={toggleCategory}/>Kids
                    </p>
                  </div>

          </div>
          {/* Sub Category filter */}
           <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '': 'hidden'} sm:block`}>
                  <p className='mb-3 text-sm font-medium'> Type</p>
                  <div className='flexflex-col gap-2 text-sm font-light text-gray-700'>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Topwear'} onChange={toggleSubCategory}/>Topwear
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Bottomwear'} onChange={toggleSubCategory}/>Bottomwear
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type='checkbox' value={'Winterwear'} onChange={toggleSubCategory}/>Winterwear
                    </p>
                  </div>

          </div>
        </div>
      {/** Right side view  */}

      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
              <Title text1={ 'All' } text2 = {'Collections'}/>
              {/** Product sort  */}
              <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
                  <option value="relavent">Sort by:Relavent</option>
                  <option value="low-high">Sort by: Low to High </option>
                  <option value="high-low">Sort by: High to Low</option>

              </select>
        </div> 
        {/** map products  */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

                  {filterProduct.map((item,index)=>(
                      <ProductItems key={index} id={item._id} name = {item.name} price={item.price} image={item.image} inventory={item.inventory}/>
                  ))}
        </div>

      </div>
      
    </div>
  )
}

export default Collection
