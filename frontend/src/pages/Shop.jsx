import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // Sort order state
  const [viewStyle, setViewStyle] = useState("grid"); // View toggle state (grid or list)

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        let filteredProducts = filteredProductsQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });

        // Sort products based on the selected sort order
        if (sortOrder === "asc") {
          filteredProducts = filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else if (sortOrder === "desc") {
          filteredProducts = filteredProducts.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
        }

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    priceFilter,
    sortOrder,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleChecked = (value, id) => {
    const updatedCheck = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedCheck));
  };

  // Add All brands options to unique Brand
  const uniqueBrand = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value); // Update sort order
  };

  const handleViewStyleChange = (style) => {
    setViewStyle(style); // Update view style (grid or list)
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-row">
          {/* Sidebar */}
          <div className="bg-[#f9f9f9] p-3 my-2">
            <h2 className="h4 text-center py-2 px-4 text-lg bg-pink-600 text-white rounded-full mb-2">
              Filter By Categories
            </h2>
            <div className="p-4 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      onChange={(e) => handleChecked(e.target.checked, c._id)}
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-black">
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 px-4 text-lg bg-pink-600 text-white rounded-full mb-2">
              Filter By Brands
            </h2>
            <div className="p-5">
              {uniqueBrand?.map((brand, index) => (
                <div className="flex items-center mr-4 mb-5" key={index}>
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-black">
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 px-4 text-lg bg-pink-600 text-white rounded-full mb-2">
              Filter By Price
            </h2>
            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <h2 className="h4 text-center py-2 px-4 text-lg bg-pink-600 text-white rounded-full mb-2">
              Sort By Product Name
            </h2>
            <div className="p-5 w-[15rem]">
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              >
                <option value="">Select</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4 bg-black text-white px-3 py-2 rounded-full"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Product Section */}
          <div className="p-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg mb-2 font-semibold">
                {products.length} Products
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 ${
                    viewStyle === "grid"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200"
                  } rounded-l-md transition`}
                  onClick={() => handleViewStyleChange("grid")}
                >
                  Grid
                </button>
                <button
                  className={`px-4 py-2 ${
                    viewStyle === "list"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200"
                  } rounded-r-md transition`}
                  onClick={() => handleViewStyleChange("list")}
                >
                  List
                </button>
              </div>
            </div>

            <div
              className={`grid gap-4 mt-4 ${
                viewStyle === "list"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {products.length === 0 ? (
                <Loader />
              ) : (
                products.map((p) => (
                  <div className="w-full" key={p._id}>
                    <ProductCard product={p} viewStyle={viewStyle} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
