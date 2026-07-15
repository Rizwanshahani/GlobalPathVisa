import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, ShieldCheck, CheckCircle, ArrowRight, UserCheck, Star, Users, Award, X, Send, Phone, User, Mail } from "lucide-react";
import { toast } from "sonner";

const countriesList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const Home = () => {
  const navigate = useNavigate();

  // Widget Tab State: "inquiry" or "checker"
  const [activeTab, setActiveTab] = useState("inquiry");

  // Landing Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Inquiry Form State (Hero & Modal)
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "France",
    visaType: "schengen"
  });
  const [inquirySuccess, setInquirySuccess] = useState(null);

  // Eligibility Finder States
  const [citizenship, setCitizenship] = useState("United Kingdom");
  const [destinationChecker, setDestinationChecker] = useState("France");
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Trigger landing popup after 1.5s if not dismissed previously
  useEffect(() => {
    const isDismissed = localStorage.getItem("globalpath_popup_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle Inquiry Form Input
  const handleInquiryChange = (e) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value
    });
  };

  // Submit Inquiry (from Hero or Modal)
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email || !inquiryData.phone) {
      toast.error("Please fill out all fields.");
      return;
    }

    const generatedId = "GP-" + Math.floor(100000 + Math.random() * 900000);
    const newInquiry = {
      trackingId: generatedId,
      destination: inquiryData.destination,
      visaType: inquiryData.visaType,
      fullName: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock travel date 30 days out
      appointmentDate: "Pending Scheduling",
      appointmentTime: "",
      status: "Submitted",
      updatedAt: new Date().toLocaleDateString(),
      timeline: [
        { status: "Submitted", description: "Inquiry received. A visa specialist will review your details shortly.", date: new Date().toLocaleDateString(), completed: true },
        { status: "Document Audit", description: "Visa specialist auditing documents", date: "Pending", completed: false },
        { status: "Appointment Booking", description: "Securing slot at Embassy/VFS", date: "Pending", completed: false },
        { status: "Embassy Submission", description: "Visa file submitted for processing", date: "Pending", completed: false },
        { status: "Passport Dispatched", description: "Decision made and passport in transit", date: "Pending", completed: false }
      ]
    };

    // Save to LocalStorage for tracking lookup
    const existingApps = JSON.parse(localStorage.getItem("globalpath_visas") || "[]");
    existingApps.push(newInquiry);
    localStorage.setItem("globalpath_visas", JSON.stringify(existingApps));

    setInquirySuccess(generatedId);
    setShowPopup(false);
    toast.success("Free Visa Inquiry submitted successfully!");
  };

  // Close Popup and handle "Don't show again"
  const closePopup = () => {
    setShowPopup(false);
    if (dontShowAgain) {
      localStorage.setItem("globalpath_popup_dismissed", "true");
    }
  };

  const handleCheckEligibility = (e) => {
    e.preventDefault();
    
    let visaNeeded = "Yes, Tourist Visa Required";
    let estimatedTime = "Average 12 - 15 Days (Varies for all countries)";
    let documentList = [
      "Passport valid for 3+ months beyond trip date",
      "Roundtrip flight reservation (draft acceptable)",
      "Proof of accommodation (hotel booking or host invitation)",
      "Travel medical insurance (minimum €30,000 coverage)",
      "Proof of sufficient funds (last 3 months bank statements)"
    ];

    if (destinationChecker === "United Kingdom") {
      visaNeeded = "Standard Visitor Visa Required";
      estimatedTime = "Average 12 - 15 Days (Varies for all countries)";
      documentList = [
        "Current valid passport",
        "Proof of sufficient funds (bank statements & payslips)",
        "Letter from current employer confirming annual leave",
        "Detailed travel itinerary",
        "Invitation letter (if visiting friends/relatives)"
      ];
    } else if (destinationChecker === "United States") {
      visaNeeded = "US B1/B2 Visitor Visa Required";
      estimatedTime = "Average 12 - 15 Days (Varies for all countries)";
      documentList = [
        "Current valid passport",
        "Form DS-160 confirmation page with barcode",
        "Visa application fee receipt ($185)",
        "Proof of strong ties to home country (job contract, property)",
        "Mock interview preparation dossier"
      ];
    } else if (destinationChecker === "Canada") {
      visaNeeded = "Visitor Visa (TRV) Required";
      estimatedTime = "Average 12 - 15 Days (Varies for all countries)";
      documentList = [
        "Valid passport",
        "Family Information Form (IMM 5645)",
        "Proof of financial support",
        "Host invitation letter & immigration status",
        "Purpose of travel description"
      ];
    }

    if (citizenship === "United Kingdom" && ["France", "Italy", "Spain", "Germany", "Switzerland"].includes(destinationChecker)) {
      visaNeeded = "No Visa Required (Schengen Visa-free up to 90 days)";
      estimatedTime = "Instant (ETIAS pre-travel authorization from 2026)";
      documentList = [
        "Valid British passport (must have 3+ months validity left)",
        "Proof of return/onward travel ticket",
        "Evidence of sufficient funds for stay",
        "Basic travel insurance coverage"
      ];
    }

    setEligibilityResult({
      visaNeeded,
      estimatedTime,
      documents: documentList
    });
    toast.success("Visa eligibility calculation complete!");
  };

  const destinations = [
    { name: "France", region: "Schengen Europe", bg: "from-blue-600 to-indigo-800", count: "Average 12-15 Days", approvalRate: "98.7%" },
    { name: "Italy", region: "Schengen Europe", bg: "from-emerald-600 to-teal-800", count: "Average 12-15 Days", approvalRate: "99.1%" },
    { name: "Spain", region: "Schengen Europe", bg: "from-amber-500 to-orange-700", count: "Average 12-15 Days", approvalRate: "98.4%" },
    { name: "United Kingdom", region: "Visit / Tourist", bg: "from-purple-600 to-indigo-950", count: "Average 12-15 Days", approvalRate: "97.8%" },
    { name: "United States", region: "B1/B2 Visa", bg: "from-rose-600 to-red-800", count: "Average 12-15 Days", approvalRate: "96.5%" },
    { name: "Canada", region: "Visitor Visa", bg: "from-red-700 to-rose-900", count: "Average 12-15 Days", approvalRate: "97.2%" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      
      {/* LANDING POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header image/banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 text-left relative">
              <button 
                onClick={closePopup}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Free assessment</span>
              <h3 className="text-xl font-bold mt-1">Get a Free Visa Consultation</h3>
              <p className="text-xs text-slate-350 mt-1 max-w-sm">Submit your information, and a visa expert will contact you within 12 hours.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-550 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={inquiryData.name}
                    onChange={handleInquiryChange}
                    placeholder="e.g. John Smith"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-550 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={inquiryData.email}
                      onChange={handleInquiryChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-550 uppercase mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={inquiryData.phone}
                      onChange={handleInquiryChange}
                      placeholder="+44 7911 123456"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-550 uppercase mb-1">Destination Country</label>
                  <select
                    name="destination"
                    value={inquiryData.destination}
                    onChange={handleInquiryChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-850"
                  >
                    {countriesList.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-550 uppercase mb-1">Visa Category</label>
                  <select
                    name="visaType"
                    value={inquiryData.visaType}
                    onChange={handleInquiryChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-850"
                  >
                    <option value="schengen">Schengen Visitor</option>
                    <option value="uk">UK Visit Visa</option>
                    <option value="usa">US B1/B2 Visa</option>
                    <option value="canada">Canada Visitor Visa</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center text-[10px] text-slate-400 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="mr-1.5 w-3.5 h-3.5"
                  />
                  Don't show this again
                </label>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  Request Consultation <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white py-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold rounded-full text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Trusted Visa Consultancy
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Navigating Your <br />
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">Visa Journey</span>, Made Simple.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Expert documentation review, appointment booking coordination, and custom cover letters for Schengen, UK, US, and Canada visitor visas. Secure your travel plans with a 99% success rate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/apply"
                className="inline-flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm group"
              >
                Apply for Visa Assessment
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center justify-center px-6 py-4 border border-slate-700 hover:border-slate-550 text-slate-350 hover:text-white font-bold rounded-2xl transition-all text-sm"
              >
                Track Live Application
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">15,000+</span>
                <span className="text-xs text-slate-550 block mt-0.5">Approved Visas</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">99.2%</span>
                <span className="text-xs text-slate-550 block mt-0.5">Success Rate</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">10-12 Days</span>
                <span className="text-xs text-slate-550 block mt-0.5">Avg processing</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">4.8/5</span>
                <span className="text-xs text-slate-550 block mt-0.5">Trustpilot Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Widget: TABBED ASSESMENT & ELIGIBILITY */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="absolute -top-4 -right-4 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md">
              Live Auditing
            </div>

            {/* Tab Swappers */}
            <div className="flex border-b border-white/10 mb-6 gap-2">
              <button
                onClick={() => { setActiveTab("inquiry"); setInquirySuccess(null); }}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "inquiry" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"
                }`}
              >
                Inquiry Form
              </button>
              <button
                onClick={() => setActiveTab("checker")}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "checker" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"
                }`}
              >
                Eligibility Checker
              </button>
            </div>

            {/* TAB 1: INQUIRY FORM */}
            {activeTab === "inquiry" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Get Free Assessment</h3>
                <p className="text-xs text-slate-400">Fill in your contact info to register your inquiry with a visa specialist.</p>
                
                {inquirySuccess ? (
                  <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center space-y-4 animate-in fade-in duration-200">
                    <div className="inline-flex w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 items-center justify-center border border-emerald-500/20">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Consultation Reference ID</span>
                      <span className="text-lg font-mono font-bold text-indigo-400 select-all block">{inquirySuccess}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Your inquiry has been successfully registered. You can use this ID to track document audits and VFS appointment bookings.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/track?id=${inquirySuccess}`)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Track File Now
                      </button>
                      <button
                        onClick={() => setInquirySuccess(null)}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl cursor-pointer"
                      >
                        New Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={inquiryData.name}
                        onChange={handleInquiryChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={inquiryData.email}
                          onChange={handleInquiryChange}
                          placeholder="john@example.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={inquiryData.phone}
                          onChange={handleInquiryChange}
                          placeholder="+44 7900..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination</label>
                        <select
                          name="destination"
                          value={inquiryData.destination}
                          onChange={handleInquiryChange}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                          {countriesList.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visa Type</label>
                        <select
                          name="visaType"
                          value={inquiryData.visaType}
                          onChange={handleInquiryChange}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="schengen">Schengen Visitor</option>
                          <option value="uk">UK Visit Visa</option>
                          <option value="usa">US B1/B2 Visa</option>
                          <option value="canada">Canada Visitor</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md text-xs mt-2 cursor-pointer"
                    >
                      Submit Free Inquiry
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: ELIGIBILITY CHECKER */}
            {activeTab === "checker" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Find Visa Requirements</h3>
                <p className="text-xs text-slate-400">Instantly check if you need a visa and estimate core embassy processing times.</p>
                
                <form onSubmit={handleCheckEligibility} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">My Nationality</label>
                    <select
                      value={citizenship}
                      onChange={(e) => setCitizenship(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {countriesList.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination Country</label>
                    <select
                      value={destinationChecker}
                      onChange={(e) => setDestinationChecker(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {countriesList.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md text-xs mt-2 cursor-pointer"
                  >
                    Check Requirements
                  </button>
                </form>

                {eligibilityResult && (
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3 mt-4 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Assessment Outcome</span>
                      <span className="text-[9px] text-indigo-400 font-bold">{eligibilityResult.estimatedTime}</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400">
                      {eligibilityResult.visaNeeded}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-semibold">Core Documents Required:</span>
                      <ul className="space-y-1 pl-1 text-[10px] text-slate-450 list-disc list-inside leading-relaxed">
                        {eligibilityResult.documents.slice(0, 3).map((doc, idx) => (
                          <li key={idx} className="truncate">{doc}</li>
                        ))}
                        {eligibilityResult.documents.length > 3 && (
                          <li className="text-indigo-400 font-bold list-none">+{eligibilityResult.documents.length - 3} more requirements</li>
                        )}
                      </ul>
                    </div>
                    <Link
                      to={`/apply?destination=${destinationChecker}`}
                      className="inline-flex items-center text-xs text-indigo-400 font-bold hover:underline"
                    >
                      Start Full Application <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS GRID */}
      <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full text-xs">
            Where We Assist
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Popular Visa Packages
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm sm:text-base">
            Detailed consultancy packages for high-volume travel zones. Select your target country to start.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
            >
              <div className={`h-3 bg-gradient-to-r ${dest.bg}`}></div>
              
              <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase">{dest.region}</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{dest.name}</h3>
                    </div>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wide flex items-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      24/7 Available
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-100 py-3 text-slate-500">
                    <div>
                      <span className="block text-slate-400">Processing Time</span>
                      <span className="font-bold text-slate-700">{dest.count}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Approval Rate</span>
                      <span className="font-bold text-emerald-600">{dest.approvalRate}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-500">
                    <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" /> Full cover letter design</li>
                    <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" /> Bank statement stability audit</li>
                    <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" /> Biometrics slot check</li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <Link
                    to={`/apply?destination=${dest.name}`}
                    className="w-full inline-flex items-center justify-center py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors group"
                  >
                    Start Assessment
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (STEP TIMELINE) */}
      <section className="bg-slate-900 text-white py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-indigo-400 font-semibold tracking-wide uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How GlobalPath Visa Works
            </h2>
            <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-base">
              Four simple phases to guide you from initial planning to visa collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative before:hidden md:before:block before:absolute before:top-1/3 before:left-12 before:right-12 before:h-0.5 before:bg-slate-800">
            {[
              { step: "01", title: "Assessment Form", desc: "Submit your basic travel plans and upload draft document checks.", icon: <Users className="w-6 h-6 text-indigo-400" /> },
              { step: "02", title: "Specialist Review", desc: "A assigned visa specialist audits bank statements and drafts the cover letters.", icon: <Award className="w-6 h-6 text-indigo-400" /> },
              { step: "03", title: "Slot Reservation", desc: "We secure and fast-track the biometrics appointment at the consulate.", icon: <Compass className="w-6 h-6 text-indigo-400" /> },
              { step: "04", title: "Visa Issued", desc: "Attend VFS/Embassy biometrics, passport is returned with valid visa.", icon: <ShieldCheck className="w-6 h-6 text-indigo-400" /> }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-700">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => { setInquirySuccess(null); setActiveTab("inquiry"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm group"
            >
              Start Your Visa File Today
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full text-xs">
              Our Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why Travellers Choose GlobalPath
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Government portals and embassy application forms can be complicated. A single spelling discrepancy, incomplete hotel booking, or under-funded bank statement format is enough to trigger a refusal. 
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We audit your documentation, write professional cover letters addressing the visa officers, structure flight and hotel reservations, and manage appointment booking fast-tracks so you don't face rejections.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Document Auditing", desc: "Expert review of tax documentation, bank statements, and employment proof formats.", icon: <UserCheck className="w-6 h-6 text-indigo-500" /> },
              { title: "Embassy Cover Letters", desc: "Personalized cover letters outlining itinerary, economic ties to home country, and travel purpose.", icon: <Compass className="w-6 h-6 text-indigo-500" /> },
              { title: "Biometric Booking Fast-Track", desc: "Automated alert monitors to grab early appointment slots at VFS Global / TLS / BLS centers.", icon: <Star className="w-6 h-6 text-indigo-500" /> },
              { title: "End-to-End Status Tracking", desc: "Secure online dashboard tracking file verification progress with direct consultant messaging.", icon: <ShieldCheck className="w-6 h-6 text-indigo-500" /> }
            ].map((adv, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all space-y-4">
                <div className="p-3 bg-indigo-50 rounded-xl inline-block">
                  {adv.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{adv.title}</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-slate-50 py-20 px-6 sm:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reviews from Happy Travellers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Branded validation of our document auditing services (simulating Trustpilot benchmarks).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Michael Vance", role: "Schengen Visa (France)", quote: "Incredible service! I was struggling to find an appointment slot at VFS France in London. GlobalPath secured me a slot in 3 days, audited my financial statements, and my multi-entry visa was approved.", rating: 5 },
              { name: "Sana Chaudhry", role: "UK Standard Visitor Visa", quote: "Highly recommend. My previous UK visit visa was rejected due to an incorrect bank statement format. The specialists at GlobalPath audited my file, drafted a comprehensive cover letter explaining my finances, and this time my visa got approved!", rating: 5 },
              { name: "David Sterling", role: "US B1/B2 Visa", quote: "Brilliant DS-160 support and mock interview preparation. I was nervous about the US Embassy interview in London. The mock prep sessions were identical to the real questions. Visa granted for 10 years!", rating: 5 }
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 gap-0.5 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                    "{review.quote}"
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <span className="text-xs text-slate-400">{review.role}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">
                    Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. URGENT CTA BANNER */}
      <section className="bg-gradient-to-r from-indigo-900 to-slate-900 py-16 px-6 sm:px-8 text-white text-center relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/3 translate-x-1/3">
          <Compass className="w-96 h-96" />
        </div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Begin Your Travel Assessment?
          </h2>
          <p className="max-w-xl mx-auto text-slate-350 text-sm sm:text-base leading-relaxed">
            Avoid consular rejections. Let our document specialists review your financial history, book your biometrics, and write your cover letter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => { setInquirySuccess(null); setActiveTab("inquiry"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-8 py-4 bg-white text-indigo-900 font-extrabold rounded-2xl hover:bg-slate-100 transition-colors shadow-lg shadow-white/5 text-sm"
            >
              Start Online Assessment
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-indigo-400 hover:border-white text-white font-bold rounded-2xl transition-all text-sm animate-pulse"
            >
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
