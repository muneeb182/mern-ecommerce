import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
const Category = () => {
  const { data: category } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category Name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created Successfully`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Creating category Failed,Try again");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updateName) {
      toast.error("Category Name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updateCategory: {
          name: updateName,
        },
      }).unwrap();

      if(result.error){
        toast.error(result.error);
      }
      else{
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdateName('');
        setModalVisible(false)
      }


    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async(e) =>{
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if(result.error){
        toast.error(result.error);
      }
      else{
        toast.success(`${result.name} is deleted Successfully!!!`)
        setSelectedCategory(null);
        setModalVisible(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu/>
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />
        <div className="flex flex-wrap">
          {category?.map((data) => (
            <div className="mt-4 ml-3" key={data._id}>
              <button
                className="bg-pink-500 text-white py-2 px-4  rounded-lg hover:bg-pink-600 focus:outline-none focus:ring=2 focus:ring-pink-500 focus:ring-opacity-5"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(data);
                  setUpdateName(data.name);
                }}
              >
                {data.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updateName}
            setValue={(value) => setUpdateName(value)}
            handleSubmit={handleUpdateCategory}
            button="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Category;
