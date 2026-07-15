import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create new order
// @route   POST /api/v1/order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order items"
            });
        }

        // Verify and update stocks
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.name} not found`
                });
            }
            if (product.stock < item.qty) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}. Available: ${product.stock}`
                });
            }
            // Reduce stock
            product.stock -= item.qty;
            await product.save();
        }

        // Create Order
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true, // For mock payments we mark it paid instantly
            paidAt: Date.now()
        });

        const createdOrder = await order.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/order/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "firstName lastName email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the user is the owner or an admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/v1/order/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/v1/order/allorders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "id firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/v1/order/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;

        if (status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
