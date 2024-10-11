import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js'
import User from "../models/userModel.js";
// utitils function
const calcPrice = (orderItems) => {
    // Properly accumulate the price
    const itemsPrice = orderItems.reduce((acc, item) => {
        return acc + (item.price * item.qty); // Return the updated accumulator
    }, 0); // Start accumulator at 0

    // Ensure that itemsPrice is defined before proceeding
    if (!itemsPrice) {
        throw new Error("Invalid item prices. Cannot calculate order total.");
    }

    const shippingPrice = itemsPrice > 500 ? 40 : 100;
    const taxRate = 0.015;
    const taxPrice = (itemsPrice * taxRate).toFixed(2);

    const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);

    return {
        itemsPrice: itemsPrice.toFixed(2), // Ensure toFixed is called on a valid number
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice
    };
};



const createOrder = asyncHandler(async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod } = req.body;
  
      if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No Order Items");
      }
  
      const itemsForDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
      });
  
      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsForDB.find((itemFromDB) => {
          return itemFromDB._id.toString() === itemFromClient._id; // Fix the return issue
        });
  
        if (!matchingItemFromDB) {
          res.status(404);
          throw new Error(`Product Not Found ${itemFromClient._id}`);
        }
  
        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItemFromDB.price, // Use price from the database
          _id: undefined,
        };
      });
  
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(
        dbOrderItems
      );
  
      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        status: "pending"
      });
  
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Get All the orders
  const getAllOrders = async(req,res) =>{
    try {
        const orders = await Order.find({}).populate("user","id username");
        res.json(orders)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  }

  const getUserOrder = asyncHandler(async(req , res) =>{
    try {
        const order = await Order.find({user: req.user._id});
        res.json(order);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  })
  
  const countTotalOrder = asyncHandler(async(req ,res) =>{
    try {
        const total = await Order.countDocuments();
        res.json({total})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  });

  const calculateTotalSale = asyncHandler(async(req , res) =>{
    try {
        const sales = await Order.find();
        const totalSales = sales.reduce((acc , item) => acc + item.totalPrice,0);
        res.json({totalSales})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  });

  const calculateTotalSaleByDate = asyncHandler(async(req,res)=>{
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true
                }
            },
            {
                $group: {
                    _id:{
                        $dateToString: {format : '%Y-%m-%d' , date: '$paidAt'}
                    },
                    totalSales: {$sum: '$totalPrice'}
                }
            }
        ])
        res.json(salesByDate)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  });

  const getOrderById = asyncHandler(async(req,res) =>{
    try {
        const order = await Order.findById(req.params.id).populate("user","username email")
        if(order){
          if (order.user._id.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not authorized to view this order");
          }
            res.json(order)
        }
        else{
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
  });

  
  const approveOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.paymentMethod === "COD") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "approved"; // Mark order as approved

      const updatedOrder = await order.save();
      res.json({message: 'Order updated as a Paid.'});
    } else {
      res.status(400);
      throw new Error("Order is not eligible for COD approval");
    }
  })


  const markOrderAsDeliver = asyncHandler(async(req ,res) =>{
    try {
        const order = await Order.findById(req.params.id);

        if(order){
            order.isDelivered = true;
            order.deliveredAt = Date.now();
    
            const updateOrder = await order.save();
            res.json({ message: "Order delivered" })
        }
        else{
            res.status(404);
            throw new Error("Order Not found")
        }
    } catch (error) {
        res.status(500).json({error: error.message})

    }
  });

  const cancelOrder = asyncHandler(
    async (req, res) => {
      try {
        const order = await Order.findById(req.params.id);
    
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        // Check if the order is already paid or delivered
        if (order.isPaid || order.isDelivered) {
          return res.status(400).json({ message: 'Order cannot be canceled as it has been paid or delivered' });
        }
    
        // Update the status to 'canceled'
        order.status = 'cancelled';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  )

  export {createOrder , getAllOrders , getUserOrder , countTotalOrder , calculateTotalSale , calculateTotalSaleByDate , getOrderById ,approveOrder , markOrderAsDeliver , cancelOrder}