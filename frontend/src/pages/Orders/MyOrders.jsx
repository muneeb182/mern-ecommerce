import React from 'react'
import { useGetMyOrdersQuery } from '../../redux/api/orderApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Link } from 'react-router-dom'

const MyOrders = () => {
    const {data: orders , isLoading , error} = useGetMyOrdersQuery();
    console.log(orders);
    
  return (
    <div className='container mx-auto mt-8'>
        <h1 className='text-2xl font-semibold mb-4'>My Orders</h1>
        {
            isLoading ? (<Loader/>):
            (error ? <Message variant={'danger'}>{error?.data?.message}</Message>
                : orders && orders.length === 0 ? (
                    <Message>You have Not Placed any Order</Message>
                ):
                (
                    <table className='min-w-full bg-white]'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2'>Order ID</th>
                                <th className='px-4 py-2'>Date</th>
                                <th className='px-4 py-2'>Total</th>
                                <th className='px-4 py-2'>Paid</th>
                                <th className='px-4 py-2'>Delivered</th>
                                <th className='px-4 py-2'>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order) =>(
                                    <tr key={order._id} className='border-t'>
                                        <td className='py-2 px-4 text-center'>{order._id}</td>
                                        <td className='py-2 px-4 text-center'>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='py-2 px-4 text-center'>
                                            PKR {order.totalPrice}
                                        </td>
                                       
                                        <td className='py-2 px-4 text-center'>
                                        {order.isPaid ? (
                                            <span className='bg-green-600 px-2 py-1 rounded-full text-white mt-1'>Paid at: {order.paidAt.substring(0,10)}</span>
                                        ):
                                        (
                                            <span className='bg-red-600 px-2 py-1 rounded-full text-white mt-1'>Not Paid</span>
                                        )
                                    }
                                        </td>
                                        <td className='py-2 px-4 text-center'>
                                        {order.isDelivered ? (
                                            <span className='bg-green-600 px-2 py-1 rounded-full text-white mt-1'>Delivered at : {order.deliveredAt.substring(0,10)}</span>
                                        ):
                                        (
                                            <span className='bg-red-600 px-2 py-1 rounded-full text-white mt-1'>Not Delivered</span>
                                        )
                                    }
                                        </td>
                                        <td className='py-2 px-4 text-center'>
                                            <Link to={`/order/${order._id}`}
                                            className='text-blue-500 underline'
                                            >
                                                <button  className='bg-pink-600 px-2 py-1 rounded-full text-white mt-1'>
                                                    Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )

            )
        }
    </div>
  )
}

export default MyOrders