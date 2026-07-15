import { createSlice } from "@reduxjs/toolkit"


const initialUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const userSlice = createSlice({
    name:'User',
    initialState:{
        user: initialUser
    },
    reducers:{
        setUser:(state, action)=>{
            state.user= action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        }
    }
})

export const {setUser}= userSlice.actions
export default userSlice.reducer