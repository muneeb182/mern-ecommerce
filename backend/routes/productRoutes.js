import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
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
} from "../controllers/productController.js";

import {
  authentication,
  AuthorizedAdmin,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(authentication, AuthorizedAdmin, formidable(), addProduct);

router
.route("/allproducts")
.get(fetchAllProducts);
router.route('/:id/reviews').post(authentication,  checkId, addProductReviews);
router.get('/top',fetchTopProducts);
router.get('/new',fetchNewProducts);


router
  .route("/:id")
  .get(fetchProductById)
  .put(authentication, AuthorizedAdmin, formidable(), updateProductDetails)
  .delete(authentication, AuthorizedAdmin, deleteProducts);

router.route('/filtered-products').post(filterProducts)
export default router;
