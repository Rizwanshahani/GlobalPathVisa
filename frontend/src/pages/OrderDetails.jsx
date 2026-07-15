import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Package, Truck, CheckCircle2, ArrowLeft } from "lucide-react";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            toast.error("Please login to view order details");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/v1/order/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                setOrder(res.data.order);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrderDetails();
        }, 0);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
                <h2 className="text-2xl font-bold text-slate-850 mb-2">Order Not Found</h2>
                <p className="text-slate-500 mb-6">The requested order could not be located or verified.</p>
                <Link to="/products">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Back to Shop</Button>
                </Link>
            </div>
        );
    }

    // Progress bar calculations based on status
    const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentStatusIndex = statusSteps.indexOf(order.status);

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending":
                return <Package className="text-amber-500" size={24} />;
            case "Processing":
                return <CreditCard className="text-blue-500" size={24} />;
            case "Shipped":
                return <Truck className="text-indigo-500" size={24} />;
            case "Delivered":
                return <CheckCircle2 className="text-green-500" size={24} />;
            default:
                return <Package className="text-slate-550" size={24} />;
        }
    };

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Back Link */}
                <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-pink-600 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Profile
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Details</h1>
                        <p className="text-xs font-mono text-slate-400 mt-1">ID: #{order._id}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Progress Status Bar */}
                {order.status !== "Cancelled" && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {statusSteps.map((step, idx) => {
                                const isCompleted = idx <= currentStatusIndex;
                                const isCurrent = idx === currentStatusIndex;

                                return (
                                    <div key={step} className="flex flex-col items-center flex-1 relative w-full">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-pink-500 border-pink-500 text-white"
                                                : "bg-white border-slate-200 text-slate-400"
                                        } ${isCurrent ? "ring-4 ring-pink-100" : ""}`}>
                                            {isCompleted ? "✓" : idx + 1}
                                        </div>
                                        <span className={`text-xs font-bold mt-2 ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {order.status === "Cancelled" && (
                    <div className="bg-red-50 text-red-700 rounded-3xl p-6 border border-red-100 font-bold text-center text-lg mb-8">
                        ❌ This Order has been Cancelled
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Items and Shipment details */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Order Items */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Purchased Items</h2>
                            <div className="divide-y divide-slate-100">
                                {order.orderItems.map((item) => (
                                    <div key={item.product} className="flex gap-4 py-4 items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-grow">
                                            <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                                            <span className="text-xs text-slate-400 block mt-1">
                                                Qty: {item.qty} × ${item.price}
                                            </span>
                                        </div>
                                        <span className="font-black text-slate-900 text-sm">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Shipment Details</h2>
                            <div className="space-y-2 text-sm text-slate-650">
                                <p><span className="font-semibold text-slate-500">Receiver Name:</span> {order.user.firstName} {order.user.lastName}</p>
                                <p><span className="font-semibold text-slate-500">Email Address:</span> {order.user.email}</p>
                                <p><span className="font-semibold text-slate-500">Address:</span> {order.shippingAddress.address}</p>
                                <p><span className="font-semibold text-slate-500">City & Zip:</span> {order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                <p><span className="font-semibold text-slate-500">Phone No:</span> {order.shippingAddress.phoneNo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Pricing Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Status/Payment */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
                            <div className="flex gap-3 items-center">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <h4 className="text-xs text-slate-400 font-semibold uppercase">Order Status</h4>
                                    <span className="font-bold text-slate-800 text-sm">{order.status}</span>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="flex gap-3 items-center">
                                <div className="p-2.5 bg-green-50 rounded-xl">
                                    <CheckCircle2 className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xs text-slate-400 font-semibold uppercase">Payment Status</h4>
                                    <span className="font-bold text-green-700 text-xs bg-green-50 px-2 py-0.5 rounded-md">
                                        PAID via {order.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Summary */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
                            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                                Invoice Summary
                            </h3>
                            
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-800">${order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Shipping</span>
                                    <span className="font-bold text-slate-800">
                                        {order.shippingPrice === 0 ? "FREE" : `$${order.shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Tax (8%)</span>
                                    <span className="font-bold text-slate-800">${order.taxPrice.toFixed(2)}</span>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex justify-between text-sm font-bold text-slate-900">
                                    <span>Invoice Total</span>
                                    <span className="font-black text-pink-650">${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
