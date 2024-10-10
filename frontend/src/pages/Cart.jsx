import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
            <Link to="/shop" className="flex justify-center">
              Go Back
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4 text-xl font-bold">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>

                    <div className="mt-2 font-normal">{item.brand}</div>
                    <div className="mt-2 font-bold">
                      PKR{" "}
                      {item.price}
                    </div>
                  </div>

                  <div className="w-24 flex items-center">
                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() =>
                        addToCartHandler(
                          item,
                          Math.max(1, item.qty - 1) // Decrease qty but not below 1
                        )
                      }
                      disabled={item.qty === 1} // Disable when qty is 1
                    >
                      <FaMinus />
                    </button>

                    <div className="mx-2 text-lg">{item.qty}</div>

                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() =>
                        addToCartHandler(
                          item,
                          Math.min(item.countInStock, item.qty + 1) // Increase qty but not above stock
                        )
                      }
                      disabled={item.qty >= item.countInStock} // Disable when qty reaches max stock
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem] mt-8"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                  <div className="text-2xl font-semibold">
                    PKR{" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>
                  <button
                    className="bg-pink-600 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout.
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
