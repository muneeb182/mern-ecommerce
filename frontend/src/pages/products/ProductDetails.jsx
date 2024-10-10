import React from "react";
import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa";

import HeartIcon from "./HeartIcon";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  

  const userInfo = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review Created Sucessfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandlers = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const addToCartHandler = () => {
    setQty({ ...product, qty });
  };

  return (
    <>
      <div>
        <Link to="/" className=" font-semibold hover:underline ml-[10rem]">
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full  xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              />
              <HeartIcon product={product} />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] ">
                  {product.description}
                </p>
              </div>
              <p className="text-5xl my-4 font-semibold">{product.price.toLocaleString('en-US',{
                style:"currency",
                currency:"PKR"
            })}</p>
              <div className="flex justify-between items-center w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6 text-xl">
                    <FaStore className="mr-2 " /> Brand: {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 text-xl">
                    <FaClock className="mr-2 " />
                    Added: {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6 text-xl">
                    <FaStar className="mr-2 " /> Reviews: {product.numReviews}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-6 text-xl w-[8rem]">
                    <FaStar className="mr-2" />
                    Ratings: {product.rating}
                  </h1>
                  <h1 className="flex items-center mb-6 text-xl w-[10rem]">
                    <FaShoppingCart className="mr-2" />
                    Quantity: {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 text-xl w-[8rem]">
                    <FaBox className="mr-2" />
                    In Stock: {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                {/* Ratings */}
                <div className="flex justify-center items-center">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews}`}
                  />
                  <span className={`rating-text ml-[2rem] text-[#111111]}`}>
                    {product.numReviews} Review
                  </span>
                </div>
                {product.countInStock > 0 && (
                  <div className="flex items-center">
                    {/* Decrement Button */}
                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() =>
                        setQty((prevQty) => Math.max(1, prevQty - 1))
                      }
                      disabled={qty === 1} // Disable when qty is 1
                    >
                      <FaMinus />
                    </button>

                    {/* Quantity Display */}
                    <div className="mx-2 text-lg">{qty}</div>

                    {/* Increment Button */}
                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() =>
                        setQty((prevQty) =>
                          Math.min(product.countInStock, prevQty + 1)
                        )
                      }
                      disabled={qty >= product.countInStock} // Disable when qty reaches max stock
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandlers}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>
            <div className="container flex flex-wrap items-start justify-between mt-[5rem] ml-[10rem]">
              {/* Product Tabs */}
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
