import React from 'react'
import { useSelector } from 'react-redux'
import { selectFavouriteProducts } from '../../redux/features/favourite/favouriteSlice'
import Product from './Product'
const Favourite = () => {
    const favourites = useSelector((state) => state.favourites);
    
  return ( 
    <div className='ml-[10rem]'>
        <h1 className='text-lg font-bold ml-[3rem] mt-[3rem]'>
            Favourite Products
        </h1>
        <div className="flex flex-wrap">
            {
                favourites.map((product) =>(
                    <Product key={product._id} product={product}/>
                ))
            }
        </div>
    </div>
  )
}

export default Favourite