import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo : localStorage.getItem('user-Info') ? JSON.parse(localStorage.getItem('user-Info')): null,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,   
    reducers:{
        setCredientials: (state , action) =>{
            state.userInfo =   action.payload;
            localStorage.setItem("user-Info", JSON.stringify(action.payload));
            const expirationTime = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
            localStorage.setItem('expiration Time' , expirationTime);
        },

        logout: (state) =>{
            state.userInfo = null;
            localStorage.clear();
        }

    }
});

export const {setCredientials , logout} = authSlice.actions;
export default authSlice.reducer