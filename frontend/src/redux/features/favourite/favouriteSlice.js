import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
    name:'favourites',
    initialState:[],
    reducers:{
        addToFavourites:(state , actions) =>{
            // Check if the product is not already favourite
            if(!state.some((product) => product._id === actions.payload._id)){
                state.push(actions.payload);
            }
        },
        removeFromFavourites:(state, action) =>{
            // remove the product from the favourites
            return state.filter((product) => product._id !== action.payload._id)
        },
        setFavourites: (state , action) =>{
            // Set the favourite from local Storage
            return action.payload
        }
    }
});

export const {addToFavourites , removeFromFavourites , setFavourites} = favouriteSlice.actions;
export const selectFavouriteProducts = (state) => state.favourites; 
export default favouriteSlice.reducer