import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Make sure to import from 'react'

import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

export const UserApi = createApi({
  reducerPath: "UserApi", // Corrected the typo from "UsesrApi" to "UserApi"
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}user/` }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}user/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Corrected export to use `useLoginMutation`
export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
  UserApi;
