import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, Clock, FileText, CheckCircle, ArrowRight, Compass, Landmark, Plane, UserCheck, Search,
  Briefcase, Building, Sliders, ClipboardCheck, DollarSign, TrendingUp, Palmtree, Map, Scale, Globe, GraduationCap, Camera, CheckSquare, FolderOpen, AlertTriangle, ExternalLink, MessageSquare, User, Heart
} from "lucide-react";

const additionalServices = [
  { name: "Business Consulting", category: "Consulting", icon: "Briefcase", desc: "Professional guidance for establishing corporate presence abroad and business expansion strategies." },
  { name: "Business Visa", category: "Visas", icon: "Briefcase", desc: "Assistance in securing visitor and temporary visas for conferences, client negotiations, and business travels." },
  { name: "Company Immigration", category: "Immigration", icon: "Building", desc: "Custom corporate immigration audits for transferring employees and setting up overseas branch offices." },
  { name: "Customized Solutions", category: "Consulting", icon: "Sliders", desc: "Bespoke visa strategies and application blueprints tailored to complex travel histories and unique files." },
  { name: "Documentation Preparation", category: "Documentation", icon: "FileText", desc: "Comprehensive review, organization, and drafting of cover letters and application forms." },
  { name: "Documents Support", category: "Documentation", icon: "ClipboardCheck", desc: "Continuous audit and verification of certificates, identity credentials, and supporting letters." },
  { name: "Experienced Visa", category: "Visas", icon: "UserCheck", desc: "Dedicated support for senior professionals, executives, and individuals with extensive travel histories." },
  { name: "Family Visa", category: "Visas", icon: "UserCheck", desc: "Spouse, dependent, and family reunion visa guidance to keep your family together in your destination country." },
  { name: "Financial Assistance", category: "Finance", icon: "DollarSign", desc: "Consultation on meeting the strict threshold requirements of foreign embassies and visa officers." },
  { name: "Financial Documentation", category: "Finance", icon: "TrendingUp", desc: "Thorough check of bank statements, pay slips, and tax returns for stability and compliance." },
  { name: "Holiday Visas", category: "Visas", icon: "Palmtree", desc: "Leisure and tourist visas for seasonal holidays, individual travel, and group tours." },
  { name: "Immigration Consultancy", category: "Immigration", icon: "Compass", desc: "Legal advisory services for permanent residency, long-term stays, and citizenship pathways." },
  { name: "Immigration Immigration", category: "Immigration", icon: "Map", desc: "Advanced immigration counseling for dual residency and multi-jurisdiction status." },
  { name: "Immigration Laws", category: "Immigration", icon: "Scale", desc: "Keeping application strategies aligned with the latest changes in global immigration law." },
  { name: "Immigration Regulations", category: "Immigration", icon: "Shield", desc: "Compliance audits ensuring applications meet specific statutory criteria of target nations." },
  { name: "Immigration Travel", category: "Immigration", icon: "Plane", desc: "Specialized advisory for entry conditions, transit requirements, and land/sea borders." },
  { name: "Immigration Visa", category: "Visas", icon: "Globe", desc: "Pathways for permanent residence, immigrant visas, and green card equivalents." },
  { name: "International Job", category: "Consulting", icon: "Briefcase", desc: "Employment-based visa consultation and work permit application support." },
  { name: "Personalised Support", category: "Consulting", icon: "Heart", desc: "Dedicated visa agent assignments with 24/7 communications for peace of mind." },
  { name: "Personalized Assistance", category: "Consulting", icon: "User", desc: "Individualized document check-lists and customized appointment tracking." },
  { name: "Student Visa", category: "Visas", icon: "GraduationCap", desc: "Study permit application guidance for international colleges and boarding schools." },
  { name: "Student Visas", category: "Visas", icon: "GraduationCap", desc: "Multi-year educational visa assistance, visa renewals, and post-study work pathways." },
  { name: "Study Visa Requirements", category: "Visas", icon: "GraduationCap", desc: "Verification of university acceptance letters, CAS, and proof of educational funding." },
  { name: "Tourist Visas", category: "Visas", icon: "Camera", desc: "Short-stay visa facilitation for sight-seeing, medical tourism, or casual visits." },
  { name: "Travel Insurance", category: "Finance", icon: "Shield", desc: "Arranging compliant, high-limit medical cover for Schengen and worldwide requirements." },
  { name: "Uk Immigration", category: "Immigration", icon: "Landmark", desc: "Dedicated advisory for UK visas, Sponsor Licenses, and Indefinite Leave to Remain (ILR)." },
  { name: "Visa Application Process", category: "Consulting", icon: "CheckSquare", desc: "Complete workflow mapping from initial registration to passport retrieval." },
  { name: "Visa Assistance", category: "Consulting", icon: "Compass", desc: "Hands-on support during the entire booking, filing, and biometrics process." },
  { name: "Visa Consultation", category: "Consulting", icon: "MessageSquare", desc: "Free initial eligibility screening and visa strategy sessions." },
  { name: "Visa Documents", category: "Documentation", icon: "FolderOpen", desc: "Structured digital storage, template provision, and audit logs for application papers." },
  { name: "Visa Refusal", category: "Consulting", icon: "AlertTriangle", desc: "Refusal analysis and appeals/re-applications service for previously rejected cases." },
  { name: "Visas Apply", category: "Visas", icon: "ExternalLink", desc: "Fast-track booking and submission portal coordination." }
];

const iconMap = {
  Briefcase: <Briefcase className="w-5 h-5 text-indigo-600" />,
  Building: <Building className="w-5 h-5 text-indigo-600" />,
  Sliders: <Sliders className="w-5 h-5 text-indigo-600" />,
  FileText: <FileText className="w-5 h-5 text-indigo-600" />,
  ClipboardCheck: <ClipboardCheck className="w-5 h-5 text-indigo-600" />,
  UserCheck: <UserCheck className="w-5 h-5 text-indigo-600" />,
  DollarSign: <DollarSign className="w-5 h-5 text-indigo-600" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-indigo-600" />,
  Palmtree: <Palmtree className="w-5 h-5 text-indigo-600" />,
  Compass: <Compass className="w-5 h-5 text-indigo-600" />,
  Map: <Map className="w-5 h-5 text-indigo-600" />,
  Scale: <Scale className="w-5 h-5 text-indigo-600" />,
  Shield: <Shield className="w-5 h-5 text-indigo-600" />,
  Plane: <Plane className="w-5 h-5 text-indigo-600" />,
  Globe: <Globe className="w-5 h-5 text-indigo-600" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-600" />,
  Camera: <Camera className="w-5 h-5 text-indigo-600" />,
  Landmark: <Landmark className="w-5 h-5 text-indigo-600" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-indigo-600" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-indigo-600" />,
  FolderOpen: <FolderOpen className="w-5 h-5 text-indigo-600" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-indigo-600" />,
  ExternalLink: <ExternalLink className="w-5 h-5 text-indigo-600" />,
  User: <User className="w-5 h-5 text-indigo-600" />,
  Heart: <Heart className="w-5 h-5 text-indigo-600" />
};

const servicesList = [
  {
    id: "schengen",
    title: "Schengen Visa Assistance",
    description: "Get authorization to travel across any of the 29 Schengen European countries, including France, Germany, Italy, and Spain.",
    icon: <Compass className="w-10 h-10 text-indigo-500" />,
    processingTime: "Average 12 - 15 Days (Varies for all countries)",
    validity: "Up to 90 days in any 180-day period",
    popularCountries: ["France", "Germany", "Italy", "Spain", "Switzerland", "Greece"],
    requirements: [
      "Passport valid for at least 3 months beyond departure date",
      "Completed Schengen Application Form",
      "Two recent passport-sized photos",
      "Roundtrip flight reservation (mock allowed)",
      "Proof of hotel reservation / accommodation",
      "Travel insurance with minimum €30,000 coverage",
      "Last 3-6 months bank statements (showing sufficient funds)"
    ]
  },
  {
    id: "uk",
    title: "UK Standard Visitor Visa",
    description: "Guidance for tourist, business, and family visit visas to the United Kingdom, tailored to high-scrutiny applications.",
    icon: <Landmark className="w-10 h-10 text-amber-500" />,
    processingTime: "Average 12 - 15 Days (Varies for all countries)",
    validity: "6 Months (Multi-Entry standard)",
    popularCountries: ["England", "Scotland", "Wales", "Northern Ireland"],
    requirements: [
      "Current valid passport",
      "Evidence of employment/study (letter from employer)",
      "Evidence of financial support (bank statements, payslips)",
      "Detailed travel itinerary",
      "Letter of invitation (if visiting friends/family)",
      "Tuberculosis test results (if applying from certain countries)"
    ]
  },
  {
    id: "usa",
    title: "US B1/B2 Visitor Visa",
    description: "Professional support for completing the DS-160 form, paying fees, and preparing for the mandatory embassy interview.",
    icon: <Plane className="w-10 h-10 text-rose-500" />,
    processingTime: "Average 12 - 15 Days (Varies for all countries)",
    validity: "Up to 10 Years (Multiple Entry)",
    popularCountries: ["All 50 US States"],
    requirements: [
      "Valid passport valid for US travel",
      "DS-160 confirmation page & barcode",
      "Application fee payment receipt",
      "One 2x2 inch photo",
      "Proof of ties to home country (job contract, property)",
      "Mock interview preparation (included in our service)"
    ]
  },
  {
    id: "canada",
    title: "Canada Visitor Visa (TRV)",
    description: "Expert help applying for a Temporary Resident Visa or Super Visa for parents/grandparents visiting Canada.",
    icon: <UserCheck className="w-10 h-10 text-emerald-500" />,
    processingTime: "Average 12 - 15 Days (Varies for all countries)",
    validity: "Up to 10 Years (or passport expiry)",
    popularCountries: ["All Canadian Provinces"],
    requirements: [
      "Valid passport",
      "Family Information Form (IMM 5645)",
      "Proof of financial sufficiency",
      "Detailed cover letter outlining purpose of visit",
      "Invitation letter from host in Canada (with PR/citizenship status)",
      "Biometrics appointment"
    ]
  }
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Visas", "Immigration", "Documentation", "Finance", "Consulting"];

  const filteredServices = additionalServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full text-xs">
          What We Offer
        </span>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Professional Visa Services
        </h1>
        <p className="max-w-3xl mt-5 mx-auto text-xl text-slate-500">
          Our team simplifies the visa process, manages bookings, builds your travel itinerary, and audits your documentation to guarantee the highest chance of approval.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto space-y-16">
        {servicesList.map((service, index) => (
          <div
            key={service.id}
            className={`flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Service Summary Info */}
            <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-50 to-white">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-white shadow-md rounded-2xl">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                </div>
                
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>

                {/* Quick Details Table */}
                <div className="grid grid-cols-2 gap-4 mb-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-50">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Processing Time
                    </span>
                    <span className="font-semibold text-slate-800 flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                      {service.processingTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Validity Period
                    </span>
                    <span className="font-semibold text-slate-800 flex items-center text-sm">
                      <Shield className="w-4 h-4 mr-2 text-indigo-500" />
                      {service.validity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Consultancy
                    </span>
                    <span className="font-bold text-indigo-600 text-sm flex items-center">
                      Free Initial Assessment
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Availability
                    </span>
                    <span className="font-semibold text-emerald-600 text-sm flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      24/7 Support Available
                    </span>
                  </div>
                </div>

                {/* Popular Countries tags */}
                <div className="mb-8">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                    Supported Destinations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {service.popularCountries.map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-full shadow-sm"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <Link
                to={`/apply?destination=${service.popularCountries[0]}&type=${service.id}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 group text-center"
              >
                Start Application for {service.title.split(" ")[0]}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service Requirements List */}
            <div className="lg:w-1/2 p-8 sm:p-12 bg-slate-900 text-white flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold">Standard Document Checklist</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Requirements may vary based on your personal profile (employment status, bank statement stability, sponsor documentation).
              </p>
              <ul className="space-y-4">
                {service.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-sm md:text-base leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-slate-800 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-900 flex items-center justify-center text-xs font-bold">J</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border border-slate-900 flex items-center justify-center text-xs font-bold">M</div>
                </div>
                <p className="text-xs text-slate-400">
                  Join <span className="text-indigo-400 font-semibold">450+ clients</span> who applied for a {service.title.split(" ")[0]} Visa this month.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Specialized Services Portfolio */}
      <div className="max-w-7xl mx-auto mt-28 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full text-xs">
            Full Portfolio
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Specialized Visa & Support Services
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm sm:text-base">
            Explore our comprehensive suite of global mobility, immigration legal compliance, and documentation support services.
          </p>
        </div>

        {/* Search & Tabs Dashboard */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search input */}
            <div className="relative max-w-md w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specialized services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/55"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid list */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredServices.map((service, index) => (
                <div 
                  key={index}
                  className="p-6 bg-slate-50/50 hover:bg-white border border-slate-150 hover:border-indigo-150 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-indigo-600">
                        {iconMap[service.icon] || <Compass className="w-5 h-5" />}
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/apply?service=${encodeURIComponent(service.name)}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      Inquire Now
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Compass className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
              <p className="text-slate-500 font-semibold">No services found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section / Extra Trust */}
      <div className="max-w-7xl mx-auto mt-20 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <Compass className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Need a Visa for a Country Not Listed Here?</h2>
          <p className="text-slate-300 text-lg mb-8">
            We provide custom consultancy services for over 80+ countries worldwide, including Turkey, Saudi Arabia, Dubai, and Singapore. Talk to our agents today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-center"
            >
              Contact Our Consultants
            </Link>
            <Link
              to="/apply"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-400 hover:border-white font-semibold rounded-xl transition-all text-center"
            >
              Start Custom Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
