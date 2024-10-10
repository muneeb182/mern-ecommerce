import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./auth/authSlice";
import favouriteReducer from "./favourite/favouriteSlice";
import { getFavouriteFromLocalStorage } from "../../utilis/localStorage";
import cartSliceReducer from "./cart/cartSlice";
import shopSliceReducer from "./shop/shopSlice";
const initialFavourites = getFavouriteFromLocalStorage() || [];

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        favourites:favouriteReducer,
        cart: cartSliceReducer,
        shop: shopSliceReducer
    },
    preloadedState:{
        favourites:initialFavourites
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

setupListeners(store.dispatch);
export default store;