import { apiSlice } from "./apiSlice.js";
import { Order_URL, PAYPAL_URL } from "../features/constant.js";

export const orderAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: Order_URL,
        method: "POST",
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${Order_URL}/${id}`
      }),
    }),
    approveOrder: builder.mutation({
      query: (orderid) => ({
        url: `${Order_URL}/${orderid}/approve`,
        method: "PUT"
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${Order_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
        query: () => ({
            url: Order_URL
        })
    }),
    deliverOrder: builder.mutation({
      query: ( orderId ) => ({
        url: `${Order_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    getTotalOrders: builder.query({
      query: () => ({
        url: `${Order_URL}/total-order`,
      }),
      keepUnusedDataFor: 5,
    }),
    getTotalSales: builder.query({
      query: () => ({
        url: `${Order_URL}/total-sale`,
      }),
    }),
    getTotalSaleByDate: builder.query({
      query: () => ({
        url: `${Order_URL}/total-sale-date`,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useDeliverOrderMutation,
  useApproveOrderMutation,
//   
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useGetPaypalClientIdQuery,
  useGetOrderDetailsQuery,
  useGetTotalOrdersQuery,
  useGetTotalSaleByDateQuery,
  useGetTotalSalesQuery,
} = orderAPISlice;
