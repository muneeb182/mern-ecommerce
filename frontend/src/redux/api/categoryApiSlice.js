import { Category_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>({
    createCategory: builder.mutation({
        query: (categoryName) =>({
            url: `${Category_URL}`,
            method: 'POST',
            body: categoryName
        })
    }),
    updateCategory: builder.mutation({
        query: ({categoryId , updateCategory}) =>({
            url:`${Category_URL}/${categoryId}`,
            method:'PUT',
            body: updateCategory
        })
    }),
    deleteCategory: builder.mutation({
        query: (categoryId) => ({
            url:`${Category_URL}/${categoryId}`,
            method:"DELETE"
        })
    }),
    fetchCategories: builder.query({
        query:() =>({
            url: `${Category_URL}`,
            method:'GET',
        })
    })
  }) 
});

export const {useCreateCategoryMutation , useFetchCategoriesQuery, useUpdateCategoryMutation,useDeleteCategoryMutation} = categoryApiSlice
