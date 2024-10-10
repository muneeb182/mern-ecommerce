import React from 'react'
import { useSelector , useDispatch } from 'react-redux'

const FavouriteCounts = () => {
    const favourite = useSelector((state) => state.favourites);
    const favouriteCount= favourite.length;
  return (
    <div className='absolute left-2 top-8'>
        {
            favouriteCount > 0  && (
                <span className='px-1 py-0 text-sm text-white bg-pink-500 rounded-full'>
                    {favouriteCount}
                </span>
            )
        }
    </div>
  )
}

export default FavouriteCounts