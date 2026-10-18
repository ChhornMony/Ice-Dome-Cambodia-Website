"use client";

import { useEffect, useState } from "react";
import { 
  ChevronRight, 
  Loader2, 
  Package, 
  Images, 
  ShoppingBag, 
  Shield, 
  Users, 
  Snowflake 
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import InfoCard from "@/components/common/info";
import { useRouter } from "next/navigation";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const getImageUrl = (image) => {
  if (!image) return "/images/product-placeholder.png";

  if (image.startsWith("blob:")) return image;
  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/uploads/products/${image}`;
};

const getBestProductImage = (product) => {
  return product.image || product.image2 || product.image3 || "";
};

const getAdImageUrl = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1533285861748-70b4bd6cb3da?q=80&w=1000&auto=format&fit=crop"; // Fallback
  if (image.startsWith("http")) return image;
  return `${API_URL}/uploads/ads/${image}`;
};

// Picks up to `limit` products, ensuring each one has a different category.
// Falls back to filling remaining slots with leftover products if there
// aren't enough distinct categories to fill the limit.
const getUniqueByCategory = (items, limit = 5) => {
  const seenCategories = new Set();
  const result = [];
  const leftovers = [];

  for (const product of items) {
    const category = product.category || "Uncategorized";

    if (!seenCategories.has(category)) {
      seenCategories.add(category);
      result.push(product);
    } else {
      leftovers.push(product);
    }

    if (result.length >= limit) break;
  }

  // If we still have empty slots (e.g., fewer unique categories than limit),
  // fill remaining spots with leftover products so the section isn't sparse.
  for (const product of leftovers) {
    if (result.length >= limit) break;
    result.push(product);
  }

  return result;
};

const Home = () => {
  const router = useRouter();

  // --- PRODUCTS STATE ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // --- ADS STATE ---
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [adsError, setAdsError] = useState("");
  // -------------------

  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchData = async () => {
    try {
      setLoadingProducts(true);
      setLoadingAds(true);
      setProductError("");
      setAdsError("");

      const [productRes, adsRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/ads`)
      ]);

      // Handle Products
      const productResult = await productRes.json();
      if (!productRes.ok || !productResult.success) {
        throw new Error(productResult.message || "Failed to load products.");
      }
      setProducts(productResult.data.products || []);

      // Handle Ads
      const adsResult = await adsRes.json();
      if (!adsRes.ok || !adsResult.success) {
        throw new Error(adsResult.message || "Failed to load ads.");
      }
      setAds(adsResult.data.ads || []);

    } catch (error) {
      if (error.message.includes("products")) {
        setProductError(error.message || "Failed to load products.");
      } else {
        setAdsError(error.message || "Failed to load ads.");
      }
    } finally {
      setLoadingProducts(false);
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-slide logic (Dependent on `ads` length)
  useEffect(() => {
    if (ads.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [ads.length]);

  const popularProducts = getUniqueByCategory(products, 5);

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-[520px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px] overflow-hidden bg-blue-950 text-white flex items-center">
        <img
          src="/images/hero-banner.png"
          alt="Ice Dome Cambodia Rink with Skaters"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-950/85 via-blue-950/70 to-blue-950/85 md:bg-gradient-to-r md:from-blue-950 md:via-blue-950/80 md:to-transparent" />

        <div className="relative z-20 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-blue-200 font-black uppercase tracking-[0.25em] text-[11px] sm:text-xs mb-4">
              Ice Dome Cambodia
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-5">
              Experience
              <br />
              Ice Skating in
              <br />
              Cambodia
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto md:mx-0 text-blue-100 leading-relaxed font-medium">
              Fun for everyone. Book your session today and hit the ice with
              friends, family, or your team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center md:justify-start">
              <button
                onClick={() => router.push("/tickets")}
                className="bg-blue-600 hover:bg-blue-700 px-8 sm:px-10 py-4 rounded-2xl font-extrabold transition text-base sm:text-lg w-full sm:w-auto shadow-lg shadow-blue-950/20 active:scale-[0.98]"
              >
                Book Now
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="bg-white/10 border-2 border-white/70 hover:border-white px-8 sm:px-10 py-4 rounded-2xl font-extrabold hover:bg-white hover:text-blue-950 transition text-base sm:text-lg w-full sm:w-auto backdrop-blur active:scale-[0.98]"
              >
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Cards Section */}
      <section className="relative z-30 -mt-16 sm:-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mx-auto max-w-7xl">
          
          <a href="https://www.icedomecambodia.com/tickets">
          <InfoCard
            title="Today's Sessions"
            detail="12:30 PM - 2:30 PM"
            price="$7.00"
            type="calendar"
          />
          </a>
          <a href="https://www.icedomecambodia.com/pricing">
            <InfoCard
              title="Price Starts From"
              detail="$5"
              subDetail="Per 60 Minutes"
              type="price"
            />
          </a>
          <a
            href="https://maps.app.goo.gl/qLaiLXXMqL2gNCg39"
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <InfoCard
              title="Location"
              detail="Ice Dome Cambodia"
              subDetail="Phnom Penh, Cambodia"
              type="location"
            />
          </a>
        </div>
      </section>

      {/* --- REAL ADS SLIDER BANNER SECTION --- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {loadingAds ? (
           <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-12 text-center">
             <Loader2 size={36} className="animate-spin mx-auto text-blue-600 mb-4" />
             <p className="font-black text-gray-900">Loading ads...</p>
           </div>
        ) : adsError ? (
          <div className="bg-white rounded-[2rem] border border-red-100 shadow-sm py-12 text-center px-5">
             <Package size={42} className="mx-auto text-red-400 mb-4" />
             <h3 className="text-lg font-black text-gray-900">Cannot load ads</h3>
             <p className="text-sm text-red-500 mt-2">{adsError}</p>
          </div>
        ) : ads.length === 0 ? (
          // If no ads uploaded in admin, we simply show nothing (or a placeholder empty state)
          <div className="hidden"></div>
        ) : (
          <div className="relative w-full h-[250px] sm:h-[320px] lg:h-[400px] rounded-3xl overflow-hidden shadow-lg">
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Background Image */}
                <img
                  src={getAdImageUrl(ad.image)}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                
                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16 z-20 max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-md">
                    {ad.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 font-medium mb-5 drop-shadow-md max-w-xs">
                    {ad.subtitle}
                  </p>
                  {ad.cta && ad.link && (
                    <button
                      onClick={() => router.push(ad.link)}
                      className="w-fit px-6 py-2.5 bg-white text-blue-900 rounded-2xl font-extrabold hover:bg-gray-100 transition active:scale-95 shadow-lg"
                    >
                      {ad.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Slider Dots Indicator */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Equipment Section */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="text-[11px] sm:text-xs font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
              Proshop Equipment
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              Popular Equipment
            </h2>

            <p className="text-sm text-gray-500 mt-2 font-medium">
              Browse skates, hockey gear, sticks, and apparel from Ice Dome
              Proshop.
            </p>
          </div>

          <button
            onClick={() => router.push("/shop")}
            className="text-blue-600 font-extrabold flex items-center gap-1 hover:underline text-sm md:text-base w-fit group"
          >
            View All Shop <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center">
            <Loader2
              size={36}
              className="animate-spin mx-auto text-blue-600 mb-4"
            />
            <p className="font-black text-gray-900">Loading equipment...</p>
          </div>
        ) : productError ? (
          <div className="bg-white rounded-[2rem] border border-red-100 shadow-sm py-16 text-center px-5">
            <Package size={42} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-black text-gray-900">
              Cannot load equipment
            </h3>
            <p className="text-sm text-red-500 mt-2">{productError}</p>

            <button
              onClick={fetchData}
              className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center px-5">
            <Package size={42} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-black text-gray-900">
              No equipment yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Products added from the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-black text-xs">
                  {popularProducts.length}
                </span>
                Items Featured
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {popularProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={product}
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Moved: Why Skate With Us Section */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] sm:text-xs font-black text-blue-600 uppercase tracking-[0.25em] mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            A Premier Ice Skating Destination
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            From the moment you step onto the ice, we are dedicated to providing a safe, thrilling, and unforgettable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
              <Snowflake size={24} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Premium Ice Quality</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Our state-of-the-art cooling system ensures a smooth, clean, and perfectly chilled surface for every session.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
              <Users size={24} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Family Friendly</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Whether you are a seasoned pro or lacing up for the first time, our environment welcomes skaters of all ages and skill levels.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
              <Shield size={24} className="text-green-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Safety First</h3>
            <p className="text-sm text-gray-500 leading-relaxed">We prioritize your safety with strict rink supervision, well-maintained equipment, and carefully managed session capacities.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const HomeProductCard = ({ product, onClick }) => {
  const imageUrl = getImageUrl(getBestProductImage(product));
  const photoCount = [product.image, product.image2, product.image3].filter(
    Boolean
  ).length;

  const outOfStock = Number(product.stock || 0) <= 0;

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-left hover:-translate-y-0.5"
    >
      {/* Premium Shimmer Gradient Overlay (Only on hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-3xl" />

      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 group-hover:rotate-1"
          onError={(e) => {
            e.currentTarget.src = "/images/product-placeholder.png";
          }}
        />

        {/* Modernized Badges */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-black text-blue-700 uppercase shadow-sm border border-white/30 z-20">
          {product.category}
        </div>

        {photoCount > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-black text-gray-700 uppercase shadow-sm border border-white/30 flex items-center gap-1 z-20">
            <Images size={12} />
            {photoCount}/3
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* New: Floating Action on Hover */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-full p-2.5 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 pointer-events-auto">
            <ShoppingBag size={16} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1 truncate">
          {product.brand || product.color || "Ice Dome Proshop"}
        </p>

        <h3 className="font-black text-gray-900 text-sm sm:text-base line-clamp-2 min-h-[38px] group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
          {product.description || product.sizes || "Proshop equipment"}
        </p>

        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-50">
          <p className="text-blue-600 font-black text-sm sm:text-lg">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          <p
            className={`text-[10px] font-black uppercase ${outOfStock ? "text-red-500" : "text-green-600"
              }`}
          >
            {outOfStock ? "Sold out" : `${product.stock || 0} left`}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Home;