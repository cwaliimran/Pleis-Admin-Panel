"use client";
import { categoryApi } from "./Reducer/category";
import { configureStore } from "@reduxjs/toolkit";
import { highlightApi } from "./Reducer/highlight";
import { userApi } from "./Reducer/user";
import { venueTypeApi } from "./Reducer/venueType";
import { venueApi } from "./Reducer/venue";
import { useSelector } from "react-redux";
import { userSlice } from "./slice/userSlice";

export const store = configureStore({
    reducer: {
        userSlice: userSlice.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [highlightApi.reducerPath]: highlightApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [venueApi.reducerPath]: venueApi.reducer,
        [venueTypeApi.reducerPath]: venueTypeApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(categoryApi.middleware,
            highlightApi.middleware,
            userApi.middleware,
            venueApi.middleware,
            venueTypeApi.middleware,
        ),
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;


export const useMockedUser = () => {
    return useSelector((state: RootState) =>state.userSlice);
}



