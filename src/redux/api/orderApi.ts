import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Make sure to import from 'react'
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}order/`, // Corrected the baseUrl
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ orderId, userId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ orderId, userId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
    myOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => `myOrder?id=${id}`,
      providesTags: ["orders"],
    }),
    allOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => `allorder?id=${id}`,
      providesTags: ["orders"],
    }),
    OrderDetail: builder.query<OrderDetailsResponse, string>({
      query: (id) => id,
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useMyOrderQuery,
  useAllOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useOrderDetailQuery,
} = orderApi;
