import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice"
import cartSlice from "./cartSlice"
import productSlice from "./productSlice"

const store= configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice,
        products:productSlice
    }
})

export default store