import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        loading: false,
        error: null
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setProducts, setSelectedProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
