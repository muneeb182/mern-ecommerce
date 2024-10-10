import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useDeliverOrderMutation,
  useApproveOrderMutation,
  useGetOrdersQuery,
} from "../../redux/api/orderApiSlice";
import { FaCheckCircle, FaTruck, FaSpinner } from "react-icons/fa"; // Import icons
import AdminMenu from "./AdminMenu";

const AdminOrderList = () => {
  const dispatch = useDispatch();
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [approveOrderToPaid, { isLoading: isLoadingPaid }] = useApproveOrderMutation();
  const [markOrderAsDeliver, { isLoading: isLoadingDeliver }] = useDeliverOrderMutation();

  const handlePaid = async (orderId) => {
    console.log("Order ID to mark as paid:", orderId); // Debugging line
    try {
      await approveOrderToPaid(orderId).unwrap();
      toast.success("Order marked as Paid");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeliver = async (orderId) => {
    console.log("Order ID to mark as delivered:", orderId); // Debugging line
    try {
      await markOrderAsDeliver(orderId).unwrap();
      toast.success("Order marked as Delivered");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">All Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message}</Message>
      ) : (
        <>
        <table className="min-w-full border-collapse border border-gray-200 z-0">
        <AdminMenu/>
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Items  </th>

              <th className="border px-4 py-2 text-left">Order ID</th>
              <th className="border px-4 py-2 text-left">User</th>
              <th className="border px-4 py-2 text-left">Total Price</th>
              <th className="border px-4 py-2 text-left">Is Paid</th>
              <th className="border px-4 py-2 text-left">Is Delivered</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2 ">
                    <img src={order.orderItems[0].image} alt={''} className="w-[5rem] pt-2" />
                </td>
                <td className="border px-4 py-2 text-center">{order._id}</td>
                <td className="border px-4 py-2 text-center">
                  {order.user ? order.user.username : "Unknown"}
                </td>
                <td className="border px-4 py-2 text-center">
                  PKR {order.totalPrice.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.isPaid ?  `Paid at : ${order.paidAt.substring(0,10)}` : "No"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.isDelivered ? `Delivered at : ${order.deliveredAt.substring(0,10)}` : "No"}
                </td>
                <td className="px-4 py-2 text-center flex justify-center flex-row space-x-2">
                  <button
                    className={`flex items-center text-white px-2 py-1 rounded ${
                      order.isPaid ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => handlePaid(order._id)}
                    disabled={order.isPaid}
                  >
                    {isLoadingPaid && <FaSpinner className="animate-spin mr-1" />} 
                    <FaCheckCircle className="mr-1" />
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => handleDeliver(order._id)}
                    className={`flex items-center text-white px-2 py-1 rounded ${
                      order.isDelivered ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={order.isDelivered}
                  >
                    {isLoadingDeliver && <FaSpinner className="animate-spin mr-1" />} 
                    <FaTruck className="mr-1" />
                    Mark As Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

export default AdminOrderList;

