import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/userReducer";

const rootReducer = combineReducers({
  UserReducer: userReducer,
  // other reducers can go here
});

export default rootReducer;
