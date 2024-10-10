import express from "express";
import { createUser,loginUser,logoutCurrentUser,getAllUsers , getCurrentUserProfile , updateUser , deleteUserById,getUserById , updateUserById } from "../controllers/userControllers.js";
import { authentication, AuthorizedAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();
// create a route
router.route('/').post(createUser).get(authentication,AuthorizedAdmin,getAllUsers );

router.post('/auth',loginUser);
router.post('/logout',logoutCurrentUser)

router.route('/profile').get(authentication , getCurrentUserProfile).put(authentication, updateUser);

//Admin Routes
router.route('/:id').delete(authentication, AuthorizedAdmin, deleteUserById).get(authentication , AuthorizedAdmin ,getUserById).put(authentication , AuthorizedAdmin , updateUserById)


export default router;