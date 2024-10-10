import mongoose from "mongoose";

 const connectDB = async() =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/MuneebStore');
        console.log('Sucessfully connected with database');
        
    } catch (error) {
        console.error(`Error ${error.message}`)
        process.exit(1);
    }
}

export default connectDB