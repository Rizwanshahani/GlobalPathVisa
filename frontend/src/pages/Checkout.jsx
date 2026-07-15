import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, ShieldCheck } from "lucide-react";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    // Pre-populate with user shipping details if exist
    const [shippingDetails, setShippingDetails] = useState({
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        phoneNo: user?.phoneNo || ""
    });

    const [cardDetails, setCardDetails] = useState({
        cardholderName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const [loading, setLoading] = useState(false);

    const handleShippingChange = (e) => {
        setShippingDetails({
            ...shippingDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleCardChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice === 0 || itemsPrice > 50 ? 0 : 10;
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // Validations
        if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.zipCode || !shippingDetails.phoneNo) {
            toast.error("Please fill in all shipping details");
            return;
        }

        if (!cardDetails.cardholderName || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
            toast.error("Please fill in all card details for mock payment verification");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            toast.error("Your session has expired. Please log in again");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const orderPayload = {
                orderItems: cartItems,
                shippingAddress: shippingDetails,
                paymentMethod: "Card",
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            };

            const res = await axios.post("http://localhost:8000/api/v1/order", orderPayload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.data.success) {
                toast.success("Payment authorized! Order placed successfully.");
                dispatch(clearCart());
                navigate(`/order/${res.data.order._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Checkout is Empty</h2>
                <p className="text-slate-500 mb-6">You have no items in your cart to checkout.</p>
                <Link to="/products">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Shop Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Middle: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Shipping Details */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Shipping Address</h2>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Apartment, suite, unit, building, street, etc."
                                    value={shippingDetails.address}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="New York"
                                        value={shippingDetails.city}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        placeholder="10001"
                                        value={shippingDetails.zipCode}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phoneNo">Phone Number</Label>
                                <Input
                                    id="phoneNo"
                                    name="phoneNo"
                                    placeholder="+1 (555) 000-0000"
                                    value={shippingDetails.phoneNo}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mock Payment Details */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-slate-900">Mock Payment Card</h2>
                                <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-full">
                                    <ShieldCheck size={14} /> Secure Sandbox
                                </span>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cardholderName">Cardholder Name</Label>
                                <Input
                                    id="cardholderName"
                                    name="cardholderName"
                                    placeholder="John Doe"
                                    value={cardDetails.cardholderName}
                                    onChange={handleCardChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <div className="relative">
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="4111 2222 3333 4444"
                                        maxLength={19}
                                        value={cardDetails.cardNumber}
                                        onChange={handleCardChange}
                                        required
                                    />
                                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={cardDetails.expiry}
                                        onChange={handleCardChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        name="cvv"
                                        type="password"
                                        placeholder="123"
                                        maxLength={4}
                                        value={cardDetails.cvv}
                                        onChange={handleCardChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary Checkout Sidebar */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs h-fit space-y-6">
                        <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-4">
                            Review Items
                        </h3>

                        {/* Mini cart items list */}
                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                            {cartItems.map((item) => (
                                <div key={item.product} className="flex gap-3 py-3 items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50 flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-grow">
                                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                                        <span className="text-xs text-slate-400">Qty: {item.qty}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-3.5 text-xs">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-850">${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Shipping</span>
                                <span className="font-bold text-slate-850">
                                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Tax (8%)</span>
                                <span className="font-bold text-slate-850">${taxPrice.toFixed(2)}</span>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="flex justify-between text-base font-bold text-slate-900">
                                <span>Total Price</span>
                                <span className="text-xl font-black text-pink-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl cursor-pointer"
                        >
                            {loading ? "Authorizing Payment..." : `Authorize & Pay $${totalPrice.toFixed(2)}`}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Checkout;
