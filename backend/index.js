// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import orderRoutes from './routes/orderRoute.js'

// utilities
import connectDB from "./config/db.js";

// Load environment variables from .env
dotenv.config({path: '../.env'}); // This should be at the top

// Check if PORT is being loaded from .env
console.log("PORT from .env: ", process.env.PORT || 5000);  // This should log the correct port from .env

// Set port with fallback
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/products',productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders',orderRoutes);

const paypalClientId =  'AbXp0iJanqbUKDY6nEes2gRNLYhJf4EIu7Zilsw_AxGFZ1LSybJsGIY2MqU2ytR6DTjl1xUOFVhY8UD5'
app.get('/api/config/paypal', (req ,res ) =>{
    res.send({clientID : paypalClientId})
})

const __dirname = path.resolve();
app.use("/upload", express.static(path.join(__dirname + "/upload")))

// Connect with the server
app.listen(port, () => console.log(`Server running at ${port}`));
