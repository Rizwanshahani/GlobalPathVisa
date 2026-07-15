import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed! We will keep you updated with visa processing times.");
    setEmail("");
  };

  const servicesLinks = [
    { label: "Schengen Visa Consulting", to: "/services" },
    { label: "UK Visitor Visa", to: "/services" },
    { label: "US B1/B2 Visitor Visa", to: "/services" },
    { label: "Canada Travel Visa", to: "/services" }
  ];

  const companyLinks = [
    { label: "About Our Story", to: "/about" },
    { label: "Track Application", to: "/track" },
    { label: "Frequently Asked Questions", to: "/faq" },
    { label: "Contact Specialists", to: "/contact" }
  ];

  const policyLinks = [
    { label: "Terms & Conditions", to: "/faq" },
    { label: "Privacy Policy", to: "/faq" },
    { label: "Refund and Return Policy", to: "/faq" }
  ];

  const socialLinks = [
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ), 
      to: "#", 
      label: "Instagram", 
      color: "hover:bg-indigo-600 hover:text-white" 
    },
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ), 
      to: "#", 
      label: "Twitter", 
      color: "hover:bg-indigo-600 hover:text-white" 
    },
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ), 
      to: "#", 
      label: "Facebook", 
      color: "hover:bg-indigo-600 hover:text-white" 
    }
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900">
      
      {/* Top Newsletter & Brand Bar */}
      <div className="border-b border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="GlobalPath Logo" 
                className="h-10 w-auto rounded-lg border border-slate-900 shadow-md"
              />
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Premium document audits, embassy booking coordination, and fast-track processing support.
            </p>
          </div>
          
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 items-stretch justify-end">
            <div className="text-left mb-2 sm:mb-0 sm:mr-4 self-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Visa Priority Alerts</h4>
              <p className="text-[11px] text-slate-500">Subscribe for early alerts on Schengen appointment slots and rule updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md w-full">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none text-white flex-grow"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-9 px-4.5 cursor-pointer flex items-center justify-center gap-1.5 transition-colors text-xs shrink-0"
              >
                <Send size={12} />
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Services Column */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-indigo-500 pl-3">
              Visa Packages
            </h3>
            <ul className="space-y-2.5 pl-3">
              {servicesLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="text-xs hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-indigo-500 pl-3">
              Useful Resources
            </h3>
            <ul className="space-y-2.5 pl-3">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="text-xs hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Column */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-indigo-500 pl-3">
              Legals & Policies
            </h3>
            <ul className="space-y-2.5 pl-3">
              {policyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="text-xs hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase border-l-2 border-indigo-500 pl-3">
              London Office
            </h3>
            <ul className="space-y-3.5 pl-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>321-323 High Road, Chadwell Heath, Essex, RM6 6AX, London, UK</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-indigo-500 shrink-0" />
                <span>+44 207 946 0998</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-indigo-500 shrink-0" />
                <span>support@globalpathvisa.co.uk</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="text-indigo-500 shrink-0" />
                <span>Mon - Fri: 09:00 AM - 06:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Legal Disclaimer Block */}
      <div className="max-w-7xl mx-auto px-6 pb-8 border-t border-slate-900 pt-8 text-left">
        <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-900 text-[10px] text-slate-500 leading-relaxed space-y-2">
          <p className="font-bold text-slate-450 uppercase">Legal Disclaimer</p>
          <p>
            GLOBALPATH VISA SOLUTIONS is an independent private visa documentation review consultancy and cover letter design agency. We are not an official immigration bureau, government embassy, or visa processing department (such as VFS Global, TLScontact, or BLS International). We do not possess authority to grant, reject, or influence visa approvals, which rest solely with consular officers at respective government immigration ministries. Fees charged cover detailed document auditing, format validation, cover letter compilation, and appointment coordination.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span>&copy; {currentYear} GlobalPath Visa Solutions Ltd. All rights reserved.</span>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-2">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.to}
                aria-label={social.label}
                className={`w-7 h-7 rounded-lg bg-slate-900 text-slate-450 flex items-center justify-center transition-all ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
