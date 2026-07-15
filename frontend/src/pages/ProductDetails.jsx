import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSelectedProduct, setLoading, setError } from "@/redux/productSlice";
import { addToCart } from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, ShoppingCart, ArrowLeft, Send } from "lucide-react";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct: product, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchProductDetails = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const res = await axios.get(`http://localhost:8000/api/v1/product/${id}`);
            if (res.data.success) {
                dispatch(setSelectedProduct(res.data.product));
            }
        } catch (error) {
            dispatch(setError(error.message));
            toast.error("Failed to load product details");
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, id]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: qty,
                stock: product.stock
            })
        );
        toast.success(`${qty}x ${product.name} added to cart!`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Review comment cannot be empty");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            toast.error("You must log in to submit a review");
            return;
        }

        try {
            setSubmittingReview(true);
            const res = await axios.post(
                `http://localhost:8000/api/v1/product/${id}/reviews`,
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                toast.success("Review posted successfully!");
                setComment("");
                // Refresh product info to see new reviews and score
                fetchProductDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col md:flex-row gap-8 max-w-5xl w-full px-6">
                    <div className="bg-slate-200 h-96 rounded-2xl md:w-1/2"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-20 bg-slate-200 rounded w-full"></div>
                        <div className="h-12 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                <p className="text-slate-500 mb-6">The requested product could not be found or has been removed.</p>
                <Link to="/products">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Back to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* Back Link */}
                <Link to="/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-pink-600 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Products
                </Link>

                {/* Product Core Details */}
                <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    
                    {/* Product Image */}
                    <div className="bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 h-96 md:h-auto">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase tracking-wider text-pink-600 mb-2">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{product.name}</h1>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, idx) => (
                                    <Star
                                        key={idx}
                                        size={18}
                                        className={idx < Math.round(product.rating) ? "fill-amber-400" : "text-slate-200"}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)}</span>
                            <span className="text-sm text-slate-400">({product.numReviews} user reviews)</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-black text-slate-950">${product.price}</span>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="mt-auto space-y-6">
                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm text-slate-500 font-medium">Availability:</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                                    product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                                </span>
                            </div>

                            {/* Qty Selector & Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQty(Math.max(1, qty - 1))}
                                            className="px-4 py-2 hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 font-semibold text-slate-800 w-12 text-center select-none">
                                            {qty}
                                        </span>
                                        <button
                                            onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                            className="px-4 py-2 hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <Button
                                        onClick={handleAddToCart}
                                        className="bg-pink-600 hover:bg-pink-700 text-white flex-grow md:flex-grow-0 rounded-xl px-8 h-11 font-bold cursor-pointer gap-2"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review & Ratings Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
                        {product.reviews.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500">
                                No reviews yet. Be the first to share your thoughts!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{review.name}</h4>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        size={14}
                                                        className={idx < review.rating ? "fill-amber-400" : "text-slate-200"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Review Box */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs h-fit">
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Write a Review</h3>
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setRating(num)}
                                                className="cursor-pointer"
                                            >
                                                <Star
                                                    size={22}
                                                    className={num <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase">Review Comment</label>
                                    <textarea
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience with this product..."
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-pink-500"
                                        required
                                    ></textarea>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-10 rounded-xl cursor-pointer gap-2"
                                >
                                    <Send size={15} /> {submittingReview ? "Submitting..." : "Post Review"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center p-4">
                                <p className="text-sm text-slate-500 mb-4">You must be logged in to post reviews.</p>
                                <Link to="/login">
                                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">Login</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
