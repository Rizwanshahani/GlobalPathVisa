import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError } from "@/redux/productSlice";
import { addToCart } from "@/redux/cartSlice";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, SlidersHorizontal, ShoppingCart, Star } from "lucide-react";

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("newest");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const categories = ["All", "Laptops", "Smartphones", "Headphones", "Smartwatches", "Accessories"];

    const fetchProducts = async () => {
        try {
            dispatch(setLoading(true));
            const params = new URLSearchParams();
            if (keyword) params.append("keyword", keyword);
            if (category && category !== "All") params.append("category", category);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            if (sort) params.append("sort", sort);

            const res = await axios.get(`http://localhost:8000/api/v1/product?${params.toString()}`);
            if (res.data.success) {
                dispatch(setProducts(res.data.products));
            }
        } catch (error) {
            dispatch(setError(error.message));
            toast.error("Failed to load products");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, sort]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleResetFilters = () => {
        setKeyword("");
        setCategory("All");
        setMinPrice("");
        setMaxPrice("");
        setSort("newest");
        // Reset URL params manually by refetching
        setTimeout(() => {
            fetchProducts();
        }, 50);
    };

    const handleAddToCart = (product) => {
        dispatch(
            addToCart({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: 1,
                stock: product.stock
            })
        );
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-slate-55/30">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Page Title & Search Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Products</h1>
                        <p className="text-sm text-slate-500">Discover our collection of premium electronics</p>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto items-center gap-2">
                        <div className="relative w-full md:w-80">
                            <Input
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="pr-10 border-slate-200 focus:border-pink-500 rounded-full"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-600">
                                <Search size={18} />
                            </button>
                        </div>
                        <Button type="button" onClick={() => setShowMobileFilters(!showMobileFilters)} className="md:hidden bg-pink-100 text-pink-700 hover:bg-pink-200">
                            <SlidersHorizontal size={18} />
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar Filters (Desktop) */}
                    <div className={`lg:block ${showMobileFilters ? "block" : "hidden"} bg-white p-6 rounded-2xl shadow-xs border border-slate-100 h-fit space-y-6`}>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
                            <div className="flex flex-col gap-1.5">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                            category === cat
                                                ? "bg-pink-500 text-white font-medium"
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="h-9 text-xs"
                                />
                                <span className="text-slate-400">-</span>
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <Button onClick={fetchProducts} className="w-full mt-3 bg-pink-600 text-white hover:bg-pink-700 text-xs py-2 h-8">
                                Apply
                            </Button>
                        </div>

                        <hr className="border-slate-100" />

                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Sort By</h3>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-pink-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Top Rated</option>
                            </select>
                        </div>

                        <Button onClick={handleResetFilters} variant="outline" className="w-full text-slate-500 hover:bg-slate-50 border-slate-200 text-xs">
                            Reset All Filters
                        </Button>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 h-96">
                                        <div className="bg-slate-200 h-48 rounded-xl w-full mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded-sm w-3/4 mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded-sm w-1/2 mb-6"></div>
                                        <div className="h-8 bg-slate-200 rounded-sm w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
                                <p className="text-slate-500 mb-6">We couldn't find any products matching your search criteria.</p>
                                <Button onClick={handleResetFilters} className="bg-pink-600 hover:bg-pink-700 text-white">
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
                                    >
                                        <Link to={`/product/${product._id}`} className="relative block bg-slate-50 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {product.stock === 0 && (
                                                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase">
                                                    Out of stock
                                                </span>
                                            )}
                                        </Link>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 mb-1.5">
                                                {product.category}
                                            </span>
                                            <Link to={`/product/${product._id}`} className="hover:text-pink-600 transition-colors">
                                                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star
                                                            key={idx}
                                                            size={14}
                                                            className={idx < Math.round(product.rating) ? "fill-amber-400" : "text-slate-200"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    ({product.numReviews})
                                                </span>
                                            </div>

                                            <p className="text-slate-500 text-xs mb-4 line-clamp-2 flex-grow">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                <span className="text-xl font-extrabold text-slate-950">${product.price}</span>
                                                <Button
                                                    disabled={product.stock === 0}
                                                    onClick={() => handleAddToCart(product)}
                                                    className="bg-pink-600 hover:bg-pink-700 text-white h-9 rounded-xl px-4 cursor-pointer gap-2"
                                                >
                                                    <ShoppingCart size={15} /> Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
