"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "@/lib/router";
import {
  ShoppingCart,
  ChevronDown,
  Check,
  ShieldCheck,
  BadgeDollarSign,
  RotateCcw,
  Headset,
  SlidersHorizontal,
  Loader2,
  Package,
  Lock,
  Search, // <-- Added Search Import
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useCart } from "@/context/useCart";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const categories = ["Skates", "Hockey Equipment", "Hockey Sticks", "Apparel"];

const sizeFilters = [
  "All",
  "30",
  "32",
  "34",
  "36",
  "40",
  "42",
  "S",
  "M",
  "L",
  "XL",
  "Sr",
  "Int",
  "Jr",
];

const getImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/400?text=Product+Image";
  }

  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/uploads/products/${image}`;
};

const normalizeSizes = (sizes) => {
  if (!sizes) return ["One Size"];

  return sizes
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
};

const TrustBadge = ({ title, desc, icon }) => (
  <div className="flex items-center gap-3 border border-gray-100 rounded-2xl px-4 sm:px-5 py-3 bg-white shadow-sm min-w-[180px] sm:min-w-[200px] shrink-0 transition-transform hover:scale-[1.02]">
    {icon && (
      <div className="text-blue-600 bg-blue-50 p-2 rounded-lg shrink-0">
        {icon}
      </div>
    )}

    <div className="leading-tight min-w-0">
      <p className="text-xs font-bold text-gray-900 truncate">{title}</p>
      <p className="text-[10px] text-gray-400 font-medium truncate">{desc}</p>
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const dropdownRef = useRef(null);

  const sizeOptions = normalizeSizes(product.sizes);
  const imageUrl = getImageUrl(product.image);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, {
      state: {
        id: product.id,
        name: product.name,
        price: product.price,
        color: product.color,
        sizes: product.sizes,
        image: imageUrl,
        category: product.category,
        stock: product.stock,
      },
    });
  };

  const requireLoginBeforeShopAction = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/shop");
      navigate("/login");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!requireLoginBeforeShopAction()) return;

    if (!selectedSize) {
      setIsOpen(true);
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        img: imageUrl,
      },
      selectedSize,
      1
    );

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const outOfStock = Number(product.stock || 0) <= 0;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl sm:rounded-[2rem] p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col relative cursor-pointer"
    >
      <div className="aspect-square bg-gray-50 rounded-2xl sm:rounded-3xl mb-3 sm:mb-5 overflow-hidden flex items-center justify-center relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {outOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[11px] sm:text-xs text-gray-400 mt-1 truncate">
          {product.color || "No color"}
        </p>

        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3">
          <p className="text-blue-600 text-base sm:text-lg font-black">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          <p
            className={`text-[10px] font-black uppercase ${
              outOfStock ? "text-red-500" : "text-green-600"
            }`}
          >
            {outOfStock ? "0 left" : `${product.stock || 0} left`}
          </p>
        </div>
      </div>

      <div
        className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative" ref={dropdownRef}>
          <button
            disabled={outOfStock}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full border rounded-xl py-2.5 text-[11px] sm:text-xs font-bold flex items-center justify-between px-3 sm:px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedSize
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-100 bg-gray-50 text-gray-600 hover:bg-white hover:border-blue-200"
            }`}
          >
            <span className="truncate">
              {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
            </span>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && !outOfStock && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 max-h-48 overflow-y-auto">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-blue-50 flex items-center justify-between group"
                >
                  <span className="truncate">{size}</span>

                  {selectedSize === size && (
                    <Check size={14} className="text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full py-3 sm:py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdded
              ? "bg-green-500 text-white shadow-green-100"
              : selectedSize
              ? "bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {outOfStock ? (
            "Out of Stock"
          ) : isAdded ? (
            <>
              <Check size={17} /> Added!
            </>
          ) : (
            <>
              {!localStorage.getItem("token") ? (
                <Lock size={17} />
              ) : (
                <ShoppingCart size={17} />
              )}
              {!localStorage.getItem("token") ? "Login to Add" : "Add"}
              <span className="hidden sm:inline">
                {!localStorage.getItem("token") ? "" : "to Cart"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Skates");
  const [globalSize, setGlobalSize] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // --- NEW SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  // -----------------------

  const filterRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load products.");
      }

      setProducts(result.data.products || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // --- NEW SEARCH FILTER ---
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (product.name || "").toLowerCase().includes(searchLower) ||
        (product.category || "").toLowerCase().includes(searchLower) ||
        (product.brand || "").toLowerCase().includes(searchLower) ||
        (product.color || "").toLowerCase().includes(searchLower);
      // -------------------------

      // Size Filter
      let matchesSize = true;
      if (globalSize !== "All") {
        const sizes = product.sizes || "";
        matchesSize = sizes.toLowerCase().includes(globalSize.toLowerCase());
      }

      return matchesSearch && matchesSize;
    });
  }, [products, globalSize, searchQuery]);

  const groupedProducts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = filteredProducts.filter(
        (product) => product.category === category
      );
      return acc;
    }, {});
  }, [filteredProducts]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    const id = tab.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(id);

    if (element) {
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8 pt-24 lg:pt-28 pb-16 sm:pb-20">
        <div className="pb-6 sm:pb-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <p className="text-[11px] sm:text-sm font-black text-blue-600 uppercase tracking-[0.22em] mb-2">
                Ice Dome Cambodia
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Shop Equipment
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium leading-relaxed">
                High quality gear for skaters and hockey players.
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 overflow-x-auto w-full pb-1">
              <TrustBadge
                icon={<ShieldCheck size={20} />}
                title="100% Authentic"
                desc="Genuine products"
              />
              <TrustBadge
                icon={<BadgeDollarSign size={20} />}
                title="Best Prices"
                desc="Competitive pricing"
              />
              <TrustBadge
                icon={<RotateCcw size={20} />}
                title="Easy Returns"
                desc="Hassle free"
              />
              <TrustBadge
                icon={<Headset size={20} />}
                title="Need Help?"
                desc="+855 17750173"
              />
            </div>
          </div>
        </div>

        {/* --- UPDATED FILTER BAR WITH SEARCH --- */}
        <div className="sticky top-[72px] sm:top-[80px] z-40 bg-white/95 backdrop-blur-md rounded-2xl p-2 mb-8 sm:mb-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 shadow-sm border border-gray-100">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full lg:w-auto lg:min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition placeholder:text-gray-400"
            />
          </div>

          {/* Categories Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto px-1 sm:px-2 scrollbar-hide">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Size Filter */}
          <div className="relative w-full lg:w-auto" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition w-full md:w-auto justify-center bg-white"
            >
              <SlidersHorizontal size={16} />
              Filter: {globalSize}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 w-full md:w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2 max-h-64 overflow-y-auto">
                {sizeFilters.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setGlobalSize(size);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-blue-50 ${
                      globalSize === size ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* ------------------------------------- */}

        {loading ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-20 text-center">
            <Loader2
              size={38}
              className="animate-spin mx-auto text-blue-600 mb-4"
            />
            <p className="font-black text-gray-900">Loading products...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we load shop equipment.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="bg-white rounded-[2rem] border border-red-100 shadow-sm py-20 text-center px-5">
            <Package size={42} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-black text-gray-900">
              Cannot load products
            </h3>
            <p className="text-sm text-red-500 mt-2">{errorMessage}</p>

            <button
              onClick={fetchProducts}
              className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          // --- NEW: Empty state when no search results are found ---
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-20 text-center px-5">
            <Search size={46} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-black text-gray-900">
              No products found
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or filters to find what you need.
            </p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryProducts = groupedProducts[category] || [];

            if (categoryProducts.length === 0) {
              return null;
            }

            return (
              <ProductSection
                key={category}
                title={category}
                id={category.toLowerCase().replace(/\s+/g, "-")}
              >
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductSection>
            );
          })
        )}
      </main>
    </div>
  );
};

const ProductSection = ({ id, title, children }) => (
  <section id={id} className="mb-12 sm:mb-16 scroll-mt-32">
    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 sm:mb-8 px-1 sm:px-2">
      {title}
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
      {children}
    </div>
  </section>
);

export default Shop;