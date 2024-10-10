import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
    

  const handleSubmit = async(e) => {
  
    try {
        const productData = new FormData();
        productData.append('image',image);
        productData.append('name',name);
        productData.append('description',description);
        productData.append('price',price);
        productData.append('category',category);
        productData.append('quantity',quantity);
        productData.append('brand',brand);
        productData.append('countInStock',stock);

        const {data} = await createProduct(productData);

        if(data.error){
            toast.error('Product Create Failed')
        }
        else{
            toast.success(`${data.name} is created`);
            navigate('/')
        }

    } catch (error) {
        toast.error('Product Created Failed....')
    }
  }

  const uploadFileHandler = async(e) => {
    const formData = new FormData();
    formData.append('image',e.target.files[0]);

    try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success('Image Uploaded Suessfully');
        setImage(res.image);
        setImageURL(res.image)
    } catch (error) {
        toast.error(error?.data?.message || error.error)
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu/>
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-semibold text-3xl">Create Product</div>
          {imageURL && (
            <div className="text-center">
              <img
                src={imageURL}
                alt="products"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <div className="mb-3">
            <label
              className="border text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11"
            >
              {image ? image.name : "Upload a Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-black"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="one ml-3  ">
                <label htmlFor="name">Price</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="one">
                <label htmlFor="name">Quantity</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="one ml-3">
                <label htmlFor="name">Brand</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 border rounded-lg w-[95%]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex flex-between">
              <div>
                <label htmlFor="name block">Count In Stock</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg "
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="ml-3 ">
                <label htmlFor="">Category</label> <br />
                <select placeholder='Choose Category' className="p-4 mb-3 w-[30rem] border rounded-lg "
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                   {
                    categories?.map((data) => (
                        <option key={data._id} value={data._id}>{data.name}</option>
                    ))
                   } 
                </select>
              </div>
            </div>

            <button
             onClick={handleSubmit}
             className="py-4 px-10 mt-5 rounded-lg font-bold bg-pink-600">Submit</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
