import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartItmeSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cartItem: cartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
