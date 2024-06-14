import { configureStore } from "@reduxjs/toolkit";

import { UserApi } from "./api/UserApi";
import { userReducer } from "./reducer/userReducer";
import { ProductApi } from "./api/ProductApi";
import { cartReducer } from "./reducer/cartRedeucer";
import { orderApi } from "./api/orderApi";
import { dashboardApi } from "./api/dashboard";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartReducer.reducerPath]: cartReducer.reducer,
    [userReducer.name]: userReducer.reducer,
  },
  middleware: (mid) => [
    ...mid(),
    UserApi.middleware,
    ProductApi.middleware,
    orderApi.middleware,
    dashboardApi.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
