import React, { useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addToFavourites, removeFromFavourites, setFavourites } from '../../redux/features/favourite/favouriteSlice';
import { addFavouritesInLocalStorage, removeFavouritesFromLocalStorage, getFavouriteFromLocalStorage } from '../../utilis/localStorage';

const HeartIcon = ({ product }) => {
    const dispatch = useDispatch();
    const favourites = useSelector((state) => state.favourites || []);

    // Ensure product has _id before checking if it's in favourites
    const isFavourite =  favourites.some((p) => p._id === product._id);

    useEffect(() => {
        const favouritesFromLocalStorage = getFavouriteFromLocalStorage();
        dispatch(setFavourites(favouritesFromLocalStorage));
    }, []);

    const toggleFavourites = () => {
        if (isFavourite) {
            dispatch(removeFromFavourites(product));
            removeFavouritesFromLocalStorage(product._id);
        } else {
            dispatch(addToFavourites(product));
            addFavouritesInLocalStorage(product);
        }
    };

    return (
        <div className="absolute top-2 right-5 cursor-pointer" onClick={toggleFavourites}>
            {isFavourite ? (
                <FaHeart className="text-pink-500" />
            ) : (
                <FaRegHeart className="text-gray-500" />
            )}
        </div>
    );
};

export default HeartIcon;
