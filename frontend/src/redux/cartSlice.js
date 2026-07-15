import { createSlice } from "@reduxjs/toolkit";

const initialCart = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: initialCart
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.cartItems.push(item);
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        updateQuantity: (state, action) => {
            const { product, qty } = action.payload;
            const item = state.cartItems.find((x) => x.product === product);
            if (item) {
                item.qty = qty;
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.setItem("cartItems", JSON.stringify([]));
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
