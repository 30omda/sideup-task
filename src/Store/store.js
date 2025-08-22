import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import inventoryReducer from "./api/inventory/inventorySlice";

export const store = configureStore({
    reducer: {
        
        inventory: inventoryReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
