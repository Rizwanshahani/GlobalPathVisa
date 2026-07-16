import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, ShieldCheck, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | Get Free Visa Consultation - GlobalPath";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Get in touch with GlobalPath Visa experts. Call, email, or fill out our online form to request a free visa assessment and document audit consultation.");
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Schengen Visa Consultation",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! A GlobalPath Visa consultant will contact you within 12 hours.");
      setFormData({ name: "", email: "", subject: "Schengen Visa Consultation", message: "" });
    }, 1200);
  };

  return (
    <div className="pt-28 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Connect with Us</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Talk to a Visa Consultant</h1>
          <p className="text-slate-500 text-sm">
            Have questions about Schengen requirements, appointment availability, or document checklist legalities? Get in touch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="md:col-span-1 space-y-4">
            
            {/* WhatsApp CTA */}
            <a 
              href="https://wa.me/442079460998?text=Hello%20GlobalPath%20Visa%2C%20I%20need%20assistance%20with%20my%20visa%20application."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl shadow-md transition-colors flex items-center gap-4 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={22} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Chat on WhatsApp</h4>
                <p className="text-xs text-emerald-100 mt-0.5">Instant Agent Response</p>
              </div>
            </a>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Us</h4>
                <p className="text-xs text-slate-500 mt-0.5 select-all">support@globalpathvisa.co.uk</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Call Support</h4>
                <p className="text-xs text-slate-500 mt-0.5 select-all">+44 207 946 0998</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">London Office</h4>
                <p className="text-xs text-slate-500 mt-0.5">321-323 High Road, Chadwell Heath, Essex</p>
              </div>
            </div>

            {/* Map Mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-150 h-36 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80"
                alt="London location map guide"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <span className="bg-white/95 text-slate-800 text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-indigo-600" /> Chadwell Heath, London
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-md text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Send an Online Inquiry</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-600">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-600">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. john@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-600">Visa Subject Category</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
                >
                  <option value="Schengen Visa Consultation">Schengen Visa Consultation</option>
                  <option value="UK Visit Visa Assistance">UK Visit Visa Assistance</option>
                  <option value="US Visitor B1/B2 Interview Prep">US Visitor B1/B2 Interview Prep</option>
                  <option value="Canada TRV Visa Asssistance">Canada TRV Visa Assistance</option>
                  <option value="Other / Customs Inquiries">Other / Custom Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-600">Description of Inquiry</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your nationality, destination, travel dates, and current employment/funding status..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer hover:shadow-lg disabled:opacity-50"
              >
                <Send size={14} /> {loading ? "Sending details..." : "Send Secure Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
