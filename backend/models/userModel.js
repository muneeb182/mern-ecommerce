import mongoose from "mongoose";

// Create a Schema for user
const userSchema =new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin:{
            type : Boolean,
            required: true,
            default: false
        }  
    },
    {timestamps: true}
);
// Create a model
const User = mongoose.model('Users',userSchema);

export default User;