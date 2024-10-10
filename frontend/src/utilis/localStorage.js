// Add a Product to a LocalStorage
export const addFavouritesInLocalStorage = (product) =>{
const favourites = getFavouriteFromLocalStorage();
if(!favourites.some((p) => p._id === product._id)){
    favourites.push(product);
    localStorage.setItem('favourites',JSON.stringify(favourites))
}
}

//Remove a Product from loaclStorage
export const removeFavouritesFromLocalStorage = (productID) =>{
    const favourites = getFavouriteFromLocalStorage();
    const updatedFavourites = favourites.filter((p) => p._id !== productID);
    localStorage.setItem('favourites',JSON.stringify(updatedFavourites));   
}

//Retrieve favourites from localStorage
export const getFavouriteFromLocalStorage = () =>{
    const favouritesJSON = localStorage.getItem('favourites');
    return favouritesJSON ? JSON.parse(favouritesJSON) : []
} 