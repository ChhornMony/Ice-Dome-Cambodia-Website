"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Minus,
  Plus,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronRight,
  Shield,
  RotateCcw,
  Truck,
  CheckCircle2,
  Package,
  Loader2,
  AlertCircle,
  Images,
  Boxes,
  Palette,
  Building2,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useCart } from "@/context/useCart";
import { useLocation, useNavigate } from "@/lib/router";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const getImageUrl = (image) => {
  if (!image) return "/images/product-placeholder.png";
  if (image.startsWith("blob:")) return image;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `${API_URL}${image}`;

  return `${API_URL}/uploads/products/${image}`;
};

const getProductImages = (product) => {
  const images = [product?.image, product?.image2, product?.image3].filter(
    Boolean
  );

  if (images.length === 0) return ["/images/product-placeholder.png"];

  return images;
};

const ProductDetail = () => {
  const params = useParams();
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const productId = params?.id;
  const initialProduct = location.state?.id === productId ? location.state : null;

  const [product, setProduct] = useState(initialProduct);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!productId) {
        throw new Error("Product ID is missing.");
      }

      const productResponse = await fetch(`${API_URL}/api/products/${productId}`, {
        cache: "no-store",
      });

      const productResult = await productResponse.json();

      if (!productResponse.ok || !productResult.success) {
        throw new Error(productResult.message || "Failed to load product.");
      }

      setProduct(productResult.data.product);

      const productsResponse = await fetch(`${API_URL}/api/products`, {
        cache: "no-store",
      });

      const productsResult = await productsResponse.json();

      if (!productsResponse.ok || !productsResult.success) {
        throw new Error(productsResult.message || "Failed to load products.");
      }

      setAllProducts(productsResult.data.products || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    setSelectedSize("");
    setQuantity(1);
    setActiveImg(0);
  }, [productId]);

  const images = getProductImages(product);

  const sizeOptions =
    typeof product?.sizes === "string"
      ? product.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean)
      : product?.sizes || [];

  const similarProducts = useMemo(() => {
    if (!product) return allProducts.slice(0, 4);

    const sameCategory = allProducts.filter(
      (item) =>
        item.id !== product.id &&
        item.status === "ACTIVE" &&
        item.category === product.category
    );

    const fallback = allProducts.filter(
      (item) => item.id !== product.id && item.status === "ACTIVE"
    );

    return (sameCategory.length > 0 ? sameCategory : fallback).slice(0, 4);
  }, [allProducts, product]);

  const outOfStock = Number(product?.stock || 0) <= 0;

  const handleAddToCart = () => {
    if (!product) return;

    if (sizeOptions.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1500);
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        img: getImageUrl(product.image || product.image2 || product.image3),
        color: product.color || "Default",
      },
      selectedSize || "Default",
      quantity
    );

    setAddedFeedback(true);

    setTimeout(() => {
      setAddedFeedback(false);
      navigate("/cart");
    }, 900);
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name || "Ice Dome Proshop",
      text: `Check out ${product.name} at Ice Dome Cambodia Proshop`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 1500);
      }
    } catch (error) {
      // Ignore the user cancelling the native share sheet
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-24 text-center">
            <Loader2
              size={42}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="font-black text-gray-900">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition mb-8"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </button>

          <div className="bg-white rounded-[2rem] border border-red-100 shadow-sm py-20 text-center px-5">
            <AlertCircle size={44} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900">
              Cannot load product
            </h3>
            <p className="text-sm text-red-500 mt-2">
              {errorMessage || "Product not found."}
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
            >
              Back to Shop
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition mb-8"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </button>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <section className="relative bg-gradient-to-br from-blue-50 via-gray-50 to-white p-5 sm:p-6 md:p-10">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Ice Dome Proshop
                </span>
              </div>

              <button
                onClick={() => setWishlist((value) => !value)}
                className="absolute top-6 right-6 z-10 w-11 h-11 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center transition hover:scale-105"
              >
                <Heart
                  size={18}
                  fill={wishlist ? "#ef4444" : "none"}
                  color={wishlist ? "#ef4444" : "#9ca3af"}
                />
              </button>

              <div className="aspect-square rounded-[1.75rem] overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                <img
                  src={getImageUrl(images[activeImg])}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 sm:p-8"
                  onError={(e) => {
                    e.currentTarget.src = "/images/product-placeholder.png";
                  }}
                />
              </div>

              <div className="flex gap-3 mt-5 overflow-x-auto pb-1">
                {images.map((thumb, index) => (
                  <button
                    key={`${thumb}-${index}`}
                    onClick={() => setActiveImg(index)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all bg-white shrink-0 ${
                      activeImg === index
                        ? "border-blue-600 shadow-md"
                        : "border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(thumb)}
                      alt={`${product.name} photo ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = "/images/product-placeholder.png";
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-black text-gray-500 uppercase">
                <Images size={14} className="text-blue-600" />
                {images.length}/3 product photos
              </div>
            </section>

            <section className="p-6 sm:p-8 md:p-12">
              <div className="mb-8">
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
                  {product.brand || "Ice Dome Proshop"}
                </p>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <Stars rating={4.8} />
                  <span className="text-sm text-gray-400 font-semibold">
                    Product code: {product.posCode || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-3 mb-8">
                <span className="text-4xl font-black text-blue-600">
                  ${Number(product.price || 0).toFixed(2)}
                </span>

                {product.unitPrice !== null &&
                  product.unitPrice !== undefined && (
                    <span className="text-sm text-gray-400 font-bold">
                      Unit: ${Number(product.unitPrice).toFixed(2)}
                    </span>
                  )}

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    outOfStock
                      ? "text-red-600 bg-red-50"
                      : "text-green-600 bg-green-50"
                  }`}
                >
                  {outOfStock ? "Out of Stock" : `${product.stock} in stock`}
                </span>
              </div>

              <p className="text-gray-500 leading-relaxed mb-8">
                {product.description ||
                  "High-quality Ice Dome Cambodia Proshop product."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <DetailBox
                  icon={<Package size={16} />}
                  label="Category"
                  value={product.category || "—"}
                />
                <DetailBox
                  icon={<Building2 size={16} />}
                  label="Brand"
                  value={product.brand || "—"}
                />
                <DetailBox
                  icon={<Palette size={16} />}
                  label="Color"
                  value={product.color || "—"}
                />
                <DetailBox
                  icon={<Boxes size={16} />}
                  label="Stock"
                  value={`${product.stock || 0} pcs`}
                />
              </div>

              {sizeOptions.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Size / Option
                    </p>

                    <span className="text-xs font-bold text-blue-600">
                      Select one
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`px-5 py-3 rounded-xl font-black text-sm transition-all border-2 ${
                          selectedSize === size
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                            : "bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {sizeError && (
                    <p className="text-xs font-bold text-red-500 mt-3">
                      Please select a size before adding to cart.
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden sm:w-36">
                  <button
                    onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-10 text-center font-black text-gray-900">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((qty) =>
                        Math.min(Number(product.stock || 1), qty + 1)
                      )
                    }
                    disabled={outOfStock}
                    className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${
                    addedFeedback
                      ? "bg-green-500 text-white shadow-green-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <CheckCircle2 size={18} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      {outOfStock
                        ? "Out of Stock"
                        : `Add to Cart · $${(
                            Number(product.price || 0) * quantity
                          ).toFixed(2)}`}
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition relative"
                >
                  <Share2 size={16} />
                  {shareFeedback && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TrustBadge
                  icon={<Truck size={16} />}
                  title="Pickup"
                  desc="Collect at Ice Dome"
                />
                <TrustBadge
                  icon={<RotateCcw size={16} />}
                  title="Check Size"
                  desc="Confirm before use"
                />
                <TrustBadge
                  icon={<Shield size={16} />}
                  title="Secure Pay"
                  desc="Encrypted checkout"
                />
              </div>
            </section>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                You May Also Like
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Similar Products
              </h2>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {similarProducts.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-14 text-center">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="font-black text-gray-900">
                No similar products yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((item) => (
                <SimilarProductCard
                  key={item.id}
                  item={item}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const SimilarProductCard = ({ item, navigate }) => {
  const image = item.image || item.image2 || item.image3;
  const photoCount = [item.image, item.image2, item.image3].filter(Boolean)
    .length;

  return (
    <button
      onClick={() => navigate(`/product/${item.id}`, { state: item })}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left hover:shadow-lg hover:-translate-y-1 transition-all group"
    >
      <div className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={item.name}
          className="w-full h-full object-contain p-5 transition-transform group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/images/product-placeholder.png";
          }}
        />

        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-50 text-blue-600">
          {item.category}
        </span>

        {photoCount > 1 && (
          <span className="absolute bottom-3 right-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white text-gray-600 flex items-center gap-1">
            <Images size={11} />
            {photoCount}/3
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-1 truncate">
          {item.brand || item.color || "Proshop"}
        </p>

        <p className="text-sm font-black text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[34px]">
          {item.name}
        </p>

        <Stars rating={4.8} />

        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-black text-blue-600">
            ${Number(item.price || 0).toFixed(2)}
          </p>

          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={14} color="white" />
          </div>
        </div>
      </div>
    </button>
  );
};

const DetailBox = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
    <div className="text-blue-600 mb-2">{icon}</div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-sm font-black text-gray-900 mt-0.5">{value}</p>
  </div>
);

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((item) => (
      <Star
        key={item}
        size={14}
        fill={item <= Math.round(rating) ? "#f59e0b" : "none"}
        color={item <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
      />
    ))}

    <span className="text-xs font-bold text-gray-500 ml-1">{rating}</span>
  </div>
);

const TrustBadge = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
    <span className="text-blue-600">{icon}</span>
    <p className="text-[10px] font-black text-gray-700 uppercase tracking-wide leading-tight">
      {title}
    </p>
    <p className="text-[9px] text-gray-400 font-medium">{desc}</p>
  </div>
);

export default ProductDetail;