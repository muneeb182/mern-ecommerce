import { Product_URL, Upload_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${Product_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) =>({
        url:  `${Product_URL}/${productId}`
      }),
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    allProducts: builder.query({
      query: () => `${Product_URL}/allproducts`,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${Product_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${Product_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ formData, productId }) => ({
        url: `${Product_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    uploadProductImage: builder.mutation({
        query: (data) =>({
            url:`${Upload_URL}`,
            method:"POST",
            body: data
        })
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${Product_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${Product_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),
    getTopProducts: builder.query({
      query: () => `${Product_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query({
      query: () => `${Product_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({checked, radio}) => ({
        url: `${Product_URL}/filtered-products`,
        method: 'POST',
        body: {checked , radio}
      })
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetNewProductsQuery,
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
  useCreateProductMutation,
  useCreateReviewMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
