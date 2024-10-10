import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// Create a Products
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validations
    switch (true) {
      case !name:
        return res.json({ error: "Name is Required" });
      case !description:
        return res.json({ error: "Description is Required" });
      case !price:
        return res.json({ error: "Price is Required" });
      case !category:
        return res.json({ error: "Category is Required" });
      case !quantity:
        return res.json({ error: "Quantity is Required" });
      case !brand:
        return res.json({ error: "Brand is Required" });
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// update a Products
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validations
    switch (true) {
      case !name:
        return res.json({ error: "Name is Required" });
      case !description:
        return res.json({ error: "Description is Required" });
      case !price:
        return res.json({ error: "Price is Required" });
      case !category:
        return res.json({ error: "Category is Required" });
      case !quantity:
        return res.json({ error: "Quantity is Required" });
      case !brand:
        return res.json({ error: "Brand is Required" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// delete a Products
const deleteProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.findByIdAndDelete(req.params.id);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all products

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const product = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      product,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get Single Products
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Server error" });
  }
});

// Fetch All products with their category
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add a Product Reviews
const addProductReviews = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already review");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json(error.message);
  }
});

// Fetch Top Ratings Products
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Fetch Newly added Products
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(401).json(error.message);
  }
});

const filterProducts = asyncHandler( async(req, res) =>{
  try {
    const {checked , radio} = req.body;

    let args = {};
    if(checked.length > 0) args.category = checked;
    if(radio.length) args.price = {$gte: radio[0] , $lte: radio[1]}

    const products = await Product.find(args);
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Server Error'})
  }
})

export {
  addProduct,
  updateProductDetails,
  deleteProducts,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReviews,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts
};
