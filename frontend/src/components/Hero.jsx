import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-slate-950 text-white min-h-[90vh] flex items-center overflow-hidden">
      
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 w-full z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-pink-400 text-xs font-bold tracking-wide uppercase backdrop-blur-xs">
              <Sparkles size={14} className="animate-pulse" /> 100% Authentic Products
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Elevate Your <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Digital Aura
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed">
              Discover cutting-edge technology with unbeatable deals on premium
              smartphones, high-performance laptops, immersive headphones, and accessories.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 cursor-pointer h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-pink-500/25 flex items-center gap-2 font-bold"
                >
                  Shop Catalog <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to="/products?sort=price-asc">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-800 hover:border-pink-500/50 hover:bg-slate-900/60 text-slate-350 px-8 cursor-pointer h-12 rounded-xl transition-all duration-300"
                >
                  View Deals
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900/80 max-w-md">
              <div>
                <h4 className="text-2xl font-black text-white">5k+</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase">Customers</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">99%</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase">Satisfaction</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">24h</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase">Fast Dispatch</p>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Image with Tech Framing */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-3xl blur-[30px] opacity-40 pointer-events-none"></div>
            
            <div className="relative p-2.5 bg-slate-900/50 border border-slate-800/80 rounded-3xl backdrop-blur-md shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-slate-700/60 group">
              <img
                src="/aura-hero1.png"
                alt="Latest Electronics Showcase"
                width={500}
                height={400}
                className="rounded-2xl object-cover"
                onError={(e) => {
                  // Fallback if local image doesn't exist
                  e.target.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80";
                }}
              />
              
              {/* Floating Tag */}
              <div className="absolute bottom-6 left-6 bg-slate-950/90 border border-slate-800 text-white rounded-2xl px-4 py-3 shadow-xl backdrop-blur-lg flex items-center gap-3 animate-bounce">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 leading-none">Special Offer</p>
                  <p className="text-sm font-extrabold text-pink-500 mt-1">Up to 40% Off</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;