import React from 'react'
import { useGetTopProductsQuery } from '../../redux/api/productApiSlice'
import Message from '../../components/Message'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment  from 'moment'
import { FaBox , FaClock , FaShoppingCart , FaStar , FaStore } from 'react-icons/fa'
import './ProductCarosuel.css'
const ProductCarosuel = () => {
    const {data: products , isLoading , error} = useGetTopProductsQuery(); 

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1, 
        arrow: true,
        autoplay: true,
        autoplaySpeed: 2000,
      };

  return (
    <div className='my-4 xl:block lg:block md:block'>
        {
            isLoading ? null : error ? (
                <Message variant={'danger'} >{error?.data?.message || error.message}</Message>
            ): <Slider {...settings} className='xl:w-[50rem] lg:w-[50rem] md:w-[46rem] sm:w-[40rem] sm:block '    >
                {products.map(({name , price ,_id, image , description , brand, createAt , numReviews , rating , quantity , countInStock})=>(
                    <div key={_id}>
                        <img src={image} alt={name} className='w-full rounded-lg object-cover h-[30rem]' />
                        <div className="flex justify-between w-[20rem]">
                            <div className='one'>
                            <h2 className='text-2xl font-bold mt-1'>{name}</h2>
                            <p className='font-semibold mt-1'>{price.toLocaleString('en-US',{
                style:"currency",
                currency:"PKR"
            })}</p> <br /> <br />
                            <p className='w-[25rem]'>{description.substring(0,150)}</p>
                            </div>
                        <div className="flex justify-between w-[20rem]">
                            <div className="one">
                                <h1 className="inline-flex items-center mb-6  mt-1 w-[8rem] font-semibold">
                                <FaStore className='mr-2 text-3xl '/>Brand: {brand}
                                </h1>
                                <h1 className="inline-flex items-center mb-6  mt-1   w-[15rem] font-semibold">
                                <FaClock className='mr-2 text-3xl '/>Added:{" "} {moment(createAt).fromNow()}
                                </h1>    
                                <h1 className="inline-flex items-center mb-6  mt-1   w-[8rem] font-semibold">
                                <FaStar className='mr-2 text-3xl '/>Reviews: {numReviews}
                                </h1>
                            </div>
                            <div className="two ml-3">
                                <h1 className="flex items-center mb-6 mt-1 w-[8rem]">
                                    <FaStar className='mr-2 text-3xl' /> Ratings: {" "}
                                    {Math.round(rating)}
                                </h1>
                                <h1 className="flex items-center mb-6 mt-1 w-[8rem]">
                                    <FaShoppingCart className='mr-2 text-3xl' /> Quantity: {quantity}
                                </h1>
                                <h1 className="flex items-center mb-6 mt-1 w-[8rem]">
                                    <FaBox className='mr-2 text-3xl' /> Stock: {countInStock}
                                </h1>
                            </div>    
                        </div>    
                        </div>
                    </div>
                ))}
            </Slider>
        }
    </div>
  )
}

export default ProductCarosuel