import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Make sure to import from 'react'
import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const ProductApi = createApi({
  reducerPath: "ProductApi", // Corrected the typo from "UsesrApi" to "UserApi"
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}products/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProduct: builder.query<AllProductsResponse, string>({
      query: () => "latestProduct",
      providesTags: ["product"],
    }),
    allProduct: builder.query<AllProductsResponse, string>({
      query: (id) => `getAllProducts?id=${id}`,
      providesTags: ["product"],
    }),
    Categories: builder.query<CategoriesResponse, string>({
      query: () => "Categories",
      providesTags: ["product"],
    }),
    Search: builder.query<SearchProductsResponse, SearchProductsRequest>({
      query: ({ price, search, sort, page, category }) => {
        let base = `?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;
        return base;
      },
      providesTags: ["product"],
    }),

    ProductDetailes: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductQuery,
  useAllProductQuery,
  useCategoriesQuery,
  useSearchQuery,
  useNewProductMutation,
  useProductDetailesQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;
