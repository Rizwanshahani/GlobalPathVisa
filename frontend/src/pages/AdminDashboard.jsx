import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (!user || user.role !== "admin") {
            toast.error("Access denied: admins only");
            navigate("/");
        }
    }, [user, navigate]);

    const [activeTab, setActiveTab] = useState("products"); // "products" or "orders"
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    
    const [productsLoading, setProductsLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Product Modal Form States
    const [showProductModal, setShowProductModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Laptops",
        image: "",
        stock: ""
    });

    const categories = ["Laptops", "Smartphones", "Headphones", "Smartwatches", "Accessories"];

    const fetchAdminProducts = async () => {
        try {
            setProductsLoading(true);
            const res = await axios.get("http://localhost:8000/api/v1/product");
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch {
            toast.error("Failed to load products");
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchAdminOrders = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        try {
            setOrdersLoading(true);
            const res = await axios.get("http://localhost:8000/api/v1/order/allorders", {
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
        if (user && user.role === "admin") {
            const timer = setTimeout(() => {
                fetchAdminProducts();
                fetchAdminOrders();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Product Form Actions
    const handleProductFormChange = (e) => {
        setProductForm({
            ...productForm,
            [e.target.name]: e.target.value
        });
    };

    const openAddProductModal = () => {
        setIsEditing(false);
        setEditingProductId(null);
        setProductForm({
            name: "",
            description: "",
            price: "",
            category: "Laptops",
            image: "",
            stock: ""
        });
        setShowProductModal(true);
    };

    const openEditProductModal = (product) => {
        setIsEditing(true);
        setEditingProductId(product._id);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock
        });
        setShowProductModal(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            if (isEditing) {
                // Update
                const res = await axios.put(
                    `http://localhost:8000/api/v1/product/${editingProductId}`,
                    productForm,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                if (res.data.success) {
                    toast.success("Product updated successfully!");
                    fetchAdminProducts();
                    setShowProductModal(false);
                }
            } else {
                // Create
                const res = await axios.post("http://localhost:8000/api/v1/product", productForm, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.data.success) {
                    toast.success("Product added successfully!");
                    fetchAdminProducts();
                    setShowProductModal(false);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Product operation failed");
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                toast.success("Product deleted successfully");
                fetchAdminProducts();
            }
        } catch {
            toast.error("Failed to delete product");
        }
    };

    // Order Actions
    const handleStatusChange = async (orderId, newStatus) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const res = await axios.put(
                `http://localhost:8000/api/v1/order/${orderId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (res.data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchAdminOrders();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="pt-28 pb-16 min-h-screen bg-slate-55/20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
                        <p className="text-sm text-slate-500">Manage store inventory, catalog details, and customer checkout cycles</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab("products")}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                activeTab === "products"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-650 hover:bg-slate-50 border border-slate-200"
                            }`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                activeTab === "orders"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-650 hover:bg-slate-50 border border-slate-200"
                            }`}
                        >
                            Orders
                        </button>
                    </div>
                </div>

                {/* Products Administration Dashboard */}
                {activeTab === "products" && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Manage Catalog</h2>
                            <Button onClick={openAddProductModal} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl h-10 px-5 gap-2 cursor-pointer">
                                <Plus size={16} /> Add Product
                            </Button>
                        </div>

                        {productsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">No products in catalog. Click 'Add Product' to start seeding.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-4 rounded-l-xl">Image</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4 rounded-r-xl text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map((p) => (
                                            <tr key={p._id} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 truncate max-w-xs">{p.name}</td>
                                                <td className="px-6 py-4">{p.category}</td>
                                                <td className="px-6 py-4 font-extrabold text-slate-950">${p.price}</td>
                                                <td className="px-6 py-4 font-medium">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                        p.stock > 5
                                                            ? "bg-green-50 text-green-700"
                                                            : p.stock > 0
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-red-50 text-red-700"
                                                    }`}>
                                                        {p.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditProductModal(p)}
                                                            className="p-2 hover:bg-slate-100 text-blue-500 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p._id, p.name)}
                                                            className="p-2 hover:bg-slate-100 text-red-500 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Administration Dashboard */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Track Customer Orders</h2>

                        {ordersLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">No checkout orders placed yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-650">
                                    <thead className="bg-slate-55/20 text-slate-700 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-4 rounded-l-xl">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Total Invoice</th>
                                            <th className="px-6 py-4">Payment</th>
                                            <th className="px-6 py-4">Progress Status</th>
                                            <th className="px-6 py-4 rounded-r-xl text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders.map((o) => (
                                            <tr key={o._id} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">#{o._id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{o.user?.firstName} {o.user?.lastName}</div>
                                                    <div className="text-xs text-slate-400">{o.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-extrabold text-slate-900">${o.totalPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                                                        PAID
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                                        o.status === "Delivered"
                                                            ? "bg-green-100 text-green-700"
                                                            : o.status === "Cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <select
                                                        value={o.status}
                                                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                                        className="border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 outline-none focus:border-pink-500 bg-white font-bold cursor-pointer"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Add/Edit Product Modal Dialog */}
                {showProductModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                {isEditing ? "Edit Product Details" : "Add New Product"}
                            </h3>

                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={productForm.name}
                                        onChange={handleProductFormChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={productForm.description}
                                        onChange={handleProductFormChange}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-750 focus:border-pink-500 outline-none"
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={productForm.price}
                                            onChange={handleProductFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="stock">Stock Quantity</Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            value={productForm.stock}
                                            onChange={handleProductFormChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleProductFormChange}
                                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-750 focus:border-pink-500 outline-none bg-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        placeholder="https://example.com/image.jpg"
                                        value={productForm.image}
                                        onChange={handleProductFormChange}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-pink-650 hover:bg-pink-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-4"
                                >
                                    {isEditing ? "Update Product" : "Publish Product"}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
