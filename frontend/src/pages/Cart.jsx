import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "@/redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const handleQtyChange = (product, qty, stock) => {
        if (qty < 1 || qty > stock) return;
        dispatch(updateQuantity({ product, qty }));
    };

    const handleRemove = (product, name) => {
        dispatch(removeFromCart(product));
        toast.error(`${name} removed from cart`);
    };

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice === 0 || itemsPrice > 50 ? 0 : 10;
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const handleCheckout = () => {
        if (!user) {
            toast.warning("Please log in to proceed with checkout");
            navigate("/login?redirect=checkout");
        } else {
            navigate("/checkout");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center bg-slate-55/20 text-center px-6">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-6">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-8 h-11 font-bold">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.product}
                                className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-2xs"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                                />

                                <div className="flex-grow min-w-0">
                                    <Link
                                        to={`/product/${item.product}`}
                                        className="font-bold text-slate-800 hover:text-pink-600 transition-colors truncate block"
                                    >
                                        {item.name}
                                    </Link>
                                    <span className="text-sm font-black text-slate-950 block mt-1">${item.price}</span>
                                </div>

                                {/* Qty picker */}
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <button
                                        onClick={() => handleQtyChange(item.product, item.qty - 1, item.stock)}
                                        className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 font-semibold text-slate-800 text-sm select-none">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => handleQtyChange(item.product, item.qty + 1, item.stock)}
                                        className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.product, item.name)}
                                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs h-fit space-y-6">
                        <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-4">
                            Order Summary
                        </h3>

                        <div className="space-y-3.5 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-800">${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Shipping</span>
                                <span className="font-bold text-slate-800">
                                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Tax (8%)</span>
                                <span className="font-bold text-slate-800">${taxPrice.toFixed(2)}</span>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="flex justify-between text-base font-bold text-slate-900">
                                <span>Total</span>
                                <span className="text-xl font-black text-pink-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 rounded-xl cursor-pointer gap-2"
                            >
                                Proceed to Checkout <ArrowRight size={16} />
                            </Button>
                            <Link to="/products" className="block text-center text-xs font-semibold text-pink-600 hover:underline pt-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
