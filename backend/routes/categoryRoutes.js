import express from "express";
const router = express.Router();
import { createCategory, updateCategory , deleteCategory,getAllCategory , getSingleCategory } from "../controllers/categoryControllers.js";
import { authentication, AuthorizedAdmin } from "../middlewares/authMiddleware.js";

router.route('/').post(authentication, AuthorizedAdmin,createCategory);
router.route('/:categoryId').put(authentication , AuthorizedAdmin , updateCategory);
router.route('/:categoryId').delete(authentication , AuthorizedAdmin , deleteCategory);
router.route('/').get(authentication , AuthorizedAdmin , getAllCategory);
router.route('/:id').get(authentication , AuthorizedAdmin , getSingleCategory);




export default router