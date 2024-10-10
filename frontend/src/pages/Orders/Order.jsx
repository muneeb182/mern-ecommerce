import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetOrderDetailsQuery } from "..//..//redux/api/orderApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); // Get user info from Redux state

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
  console.log(order);
  
  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect to login if the user is not logged in
    }
  }, [userInfo, navigate]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-5">Order {order._id}</h1>

      <div className="bg-white shadow-md p-6 mb-5">
        <h2 className="text-xl font-semibold mb-4">Shipping</h2>
        <p>
          <strong>Name:</strong> {order.user.username}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
        </p>
        <p>
          <strong>Address:</strong> {order.shippingAddress.address},{" "}
          {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
          {order.shippingAddress.country}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {order.isPaid ? `Paid at: ${order?.paidAt} `  : "Pending Approval"}
        </p>
      </div>

      <div className="bg-white shadow-md p-6 mb-5">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-3">Image</th>
              <th className="px-2 py-3">Product</th>
              <th className="px-2 py-3">Quantity</th>
              <th className="px-2 py-3">Price</th>
              <th className="px-2 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="px-2 py-3 text-center">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </td>
                <td className="px-2 py-3 text-center">{item.qty}</td>
                <td className="px-2 py-3 text-center">PKR {item.price}</td>
                <td className="px-2 py-3 text-center">PKR {(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="list-none">
          <li className="mb-2">
            <strong>Items Price: </strong>PKR {order.itemsPrice}
          </li>
          <li className="mb-2">
            <strong>Shipping Price: </strong>PKR {order.shippingPrice}
          </li>
          <li className="mb-2">
            <strong>Tax Price: </strong>PKR {order.taxPrice}
          </li>
          <li className="mb-2">
            <strong>Total Price: </strong>PKR {order.totalPrice}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderScreen;

