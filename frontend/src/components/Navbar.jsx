import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Visa Services", path: "/services" },
    { name: "Track Application", path: "/track" },
    { name: "About Us", path: "/about" },
    { name: "FAQs", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800 py-3"
          : "bg-slate-900 border-b border-slate-800/50 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.jpg" 
            alt="GlobalPath Logo" 
            className="h-11 w-auto rounded-lg shadow-md border border-slate-800/80 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <ul className="flex gap-6 items-center text-sm font-semibold text-slate-300">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name} className="relative py-1">
                  <Link
                    to={link.path}
                    className={`hover:text-white transition-colors duration-200 ${
                      isActive ? "text-indigo-400 font-bold" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 rounded-full"></span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="h-4 w-[1px] bg-slate-800"></div>

          {/* Apply Now Primary CTA */}
          <Link to="/apply">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl h-9 px-4.5 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 flex items-center gap-1">
              Apply Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/apply">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg py-1.5 px-3 transition-all">
              Apply
            </button>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 p-1.5 hover:bg-slate-800 rounded-lg outline-none"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl py-4 px-6 animate-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col gap-4 text-sm font-semibold text-slate-350">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1 hover:text-white ${
                    location.pathname === link.path ? "text-indigo-400 font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li className="pt-4 border-t border-slate-800">
              <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 rounded-xl flex items-center justify-center gap-1">
                  Start Visa Application
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
