import React from 'react'
import { useGetTopProductsQuery } from '../redux/api/productApiSlice'
import Loader from './Loader';
import SmallProducts from '../pages/products/SmallProducts';
import ProductCarosuel from '../pages/products/ProductCarosuel';

const Header = () => {
    const {data , isLoading , isError} = useGetTopProductsQuery();
    console.log(data);

    if(isLoading){
        return <Loader/>
    }
    
    if(isError){
        return <h1>Error while fetching the data</h1>
    }
    
  return (
    <>
    <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
            <div className="grid grid-cols-2">
                {data.map((product) =>(
                    <div key={product._id}> 
                        <SmallProducts product={product} />
                    </div>
                ))}
            </div>
        </div>
        <ProductCarosuel/>
    </div>
    </>
  )
}

export default Header