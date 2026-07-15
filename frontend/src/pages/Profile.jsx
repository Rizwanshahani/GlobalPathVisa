import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/UserSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { User, ClipboardList, MapPin, Phone, Settings } from "lucide-react";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        phoneNo: user?.phoneNo || ""
    });

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState("orders"); // "orders" or "edit"

    const fetchMyOrders = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            setOrdersLoading(true);
            const res = await axios.get("http://localhost:8000/api/v1/order/myorders", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMyOrders();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Sync state when user loads in store
    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    address: user.address || "",
                    city: user.city || "",
                    zipCode: user.zipCode || "",
                    phoneNo: user.phoneNo || ""
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            toast.error("You are logged out");
            return;
        }

        try {
            setUpdatingProfile(true);
            const res = await axios.put("http://localhost:8000/api/v1/user/update", formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Profile updated successfully!");
                setActiveTab("orders"); // Go back to orders tab
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdatingProfile(false);
        }
    };

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-extrabold text-2xl shadow-2xs">
                            {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">{user?.firstName} {user?.lastName}</h1>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-full uppercase">
                            Role: {user?.role}
                        </span>
                        {user?.role === "admin" && (
                            <Link to="/admin">
                                <Button className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 h-9 cursor-pointer gap-1.5">
                                    <Settings size={14} /> Admin Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Profile Tabs Navigation */}
                <div className="flex gap-4 border-b border-slate-200 mb-8 pb-px">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`pb-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                            activeTab === "orders"
                                ? "border-pink-500 text-pink-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <ClipboardList size={16} /> My Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`pb-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                            activeTab === "edit"
                                ? "border-pink-500 text-pink-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <User size={16} /> Edit Profile Info
                    </button>
                </div>

                {/* Tab Contents */}
                {activeTab === "orders" && (
                    <div className="space-y-6">
                        {ordersLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center text-slate-500">
                                You haven't placed any orders yet.
                                <div className="mt-4">
                                    <Link to="/products">
                                        <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">Shop Products</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-bold text-slate-400">#{order._id}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {/* Order items preview string */}
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1 max-w-md">
                                                {order.orderItems.map((item) => `${item.qty}x ${item.name}`).join(", ")}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0">
                                            <div className="text-left md:text-right">
                                                <span className="text-xs text-slate-400 block font-medium">Total</span>
                                                <span className="text-base font-extrabold text-pink-600">${order.totalPrice.toFixed(2)}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                                                    order.status === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "Cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {order.status}
                                                </span>

                                                <Link to={`/order/${order._id}`}>
                                                    <Button variant="outline" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "edit" && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Settings</h2>
                        
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" /> Shipping Destination Info
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="123 Street Name"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            placeholder="New York"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="zipCode">Zip Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            placeholder="10001"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phoneNo">
                                        <span className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" /> Phone Number
                                        </span>
                                    </Label>
                                    <Input
                                        id="phoneNo"
                                        name="phoneNo"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNo}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={updatingProfile}
                                className="bg-pink-650 hover:bg-pink-700 text-white rounded-xl font-bold h-11 px-8 cursor-pointer w-full md:w-auto"
                            >
                                {updatingProfile ? "Updating..." : "Save Changes"}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
