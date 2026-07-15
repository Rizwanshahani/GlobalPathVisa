import Product from "../models/productModel.js";

// @desc    Get all products with filters
// @route   GET /api/v1/product
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort } = req.query;

        let query = {};

        // Search Keyword
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        // Category Filter
        if (category && category !== "All") {
            query.category = category;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortBy = { createdAt: -1 }; // default: newest
        if (sort) {
            if (sort === "price-asc") {
                sortBy = { price: 1 };
            } else if (sort === "price-desc") {
                sortBy = { price: -1 };
            } else if (sort === "rating-desc") {
                sortBy = { rating: -1 };
            } else if (sort === "newest") {
                sortBy = { createdAt: -1 };
            }
        }

        const products = await Product.find(query).sort(sortBy);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product details
// @route   GET /api/v1/product/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new product (Admin only)
// @route   POST /api/v1/product
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            image,
            stock: Number(stock)
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product (Admin only)
// @route   PUT /api/v1/product/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price !== undefined ? Number(price) : product.price;
        product.category = category || product.category;
        product.image = image || product.image;
        product.stock = stock !== undefined ? Number(stock) : product.stock;

        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/v1/product/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create product review
// @route   POST /api/v1/product/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (rating === undefined || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            alreadyReviewed.rating = Number(rating);
            alreadyReviewed.comment = comment;
        } else {
            const review = {
                user: req.user._id,
                name: `${req.user.firstName} ${req.user.lastName}`,
                rating: Number(rating),
                comment
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
        }

        // Recalculate average rating
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            rating: product.rating,
            numReviews: product.numReviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
