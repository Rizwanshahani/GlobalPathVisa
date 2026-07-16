import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Calendar, FileText, User, Plane, HelpCircle, CheckCircle, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Apply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Apply Now | Visa Application & Assessment - GlobalPath";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Submit a Schengen, UK, US, or Canada visa assessment request. Book a biometrics consultation slots and get audited documents package.");
    }
  }, []);

  // Query Params pre-population
  const initDest = searchParams.get("destination") || "";
  const initType = searchParams.get("type") || "";

  // Step states
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    destination: initDest || "France",
    visaType: initType || "schengen",
    travelDate: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "United Kingdom",
    employment: "Employed",
    appointmentDate: "",
    appointmentTime: "",
    agreeToTerms: false,
  });

  // Simulated document upload states
  const [files, setFiles] = useState({
    passport: null,
    bankStatement: null,
    accommodation: null,
  });
  const [uploadProgress, setUploadProgress] = useState({
    passport: 0,
    bankStatement: 0,
    accommodation: 0,
  });

  // Available Time Slots
  const timeSlots = ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];

  // Helper to handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Helper to simulate file upload
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [fileType]: file }));
    setUploadProgress((prev) => ({ ...prev, [fileType]: 10 }));

    // Simulate progress timer
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev[fileType] >= 100) {
          clearInterval(timer);
          toast.success(`${file.name} uploaded successfully!`);
          return { ...prev, [fileType]: 100 };
        }
        return { ...prev, [fileType]: prev[fileType] + 30 };
      });
    }, 200);
  };

  // Validate step before advancing
  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.destination || !formData.visaType || !formData.travelDate) {
        toast.error("Please fill in all travel details");
        return;
      }
      // Simple date validation
      const today = new Date();
      const travel = new Date(formData.travelDate);
      if (travel <= today) {
        toast.error("Travel date must be in the future");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nationality) {
        toast.error("Please fill in all personal information");
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (currentStep === 3) {
      if (!files.passport) {
        toast.error("Passport copy is mandatory for visa assessment");
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.appointmentDate || !formData.appointmentTime) {
        toast.error("Please select an appointment date and time");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Submit assessment and generate tracking ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms to submit your application.");
      return;
    }

    setIsSubmitting(true);

    const generatedId = "GP-" + Math.floor(100000 + Math.random() * 900000);
    const fullName = `${formData.firstName} ${formData.lastName}`;

    const inquiryPayload = {
      trackingId: generatedId,
      fullName: fullName,
      email: formData.email,
      phone: formData.phone,
      destination: formData.destination,
      visaType: formData.visaType,
      travelDate: formData.travelDate
    };

    // Save to LocalStorage for fallback tracking
    const newAppLocal = {
      ...inquiryPayload,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      status: "Submitted",
      updatedAt: new Date().toLocaleDateString(),
      timeline: [
        { status: "Submitted", description: "Application submitted online", date: new Date().toLocaleDateString(), completed: true },
        { status: "Document Audit", description: "Visa specialist auditing documents", date: "Pending", completed: false },
        { status: "Appointment Booking", description: "Securing slot at Embassy/VFS", date: "Pending", completed: false },
        { status: "Embassy Submission", description: "Visa file submitted for processing", date: "Pending", completed: false },
        { status: "Passport Dispatched", description: "Decision made and passport in transit", date: "Pending", completed: false }
      ]
    };

    const existingApps = JSON.parse(localStorage.getItem("globalpath_visas") || "[]");
    existingApps.push(newAppLocal);
    localStorage.setItem("globalpath_visas", JSON.stringify(existingApps));

    try {
      const res = await axios.post("http://localhost:8000/api/v1/inquiry/create", inquiryPayload);
      if (res.data.success && formData.appointmentDate) {
        const inqId = res.data.inquiry._id;
        const timeline = [
          { status: "Submitted", description: "Application submitted online", date: new Date().toLocaleDateString(), completed: true },
          { status: "Document Audit", description: "Visa specialist auditing documents", date: "Pending", completed: false },
          { status: "Appointment Booking", description: "Biometrics consultation slot secured.", date: new Date().toLocaleDateString(), completed: true },
          { status: "Embassy Submission", description: "Visa file submitted for processing", date: "Pending", completed: false },
          { status: "Passport Dispatched", description: "Decision made and passport in transit", date: "Pending", completed: false }
        ];
        
        await axios.put(`http://localhost:8000/api/v1/inquiry/update/${inqId}`, {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          status: "Appointment Booking",
          timeline
        });

        // Update local storage too to reflect the updated status
        newAppLocal.status = "Appointment Booking";
        newAppLocal.timeline = timeline;
        const apps = JSON.parse(localStorage.getItem("globalpath_visas") || "[]");
        const idx = apps.findIndex(a => a.trackingId === generatedId);
        if (idx !== -1) {
          apps[idx] = newAppLocal;
          localStorage.setItem("globalpath_visas", JSON.stringify(apps));
        }
      }
    } catch (err) {
      console.error("Failed to save application to MongoDB:", err);
    }

    setTrackingId(generatedId);
    setIsSubmitting(false);
    setCurrentStep(6); // Success page step
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Progress Bar Header */}
        {currentStep <= 5 && (
          <div className="bg-slate-900 px-6 py-6 text-white">
            <h1 className="text-xl font-bold tracking-tight mb-2">Visa Assessment & Booking</h1>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round(((currentStep - 1) / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>
            </div>

            {/* Step icons indicating categories */}
            <div className="grid grid-cols-5 gap-2 mt-6">
              {[
                { label: "Travel", icon: <Plane className="w-4 h-4" /> },
                { label: "Personal", icon: <User className="w-4 h-4" /> },
                { label: "Documents", icon: <FileText className="w-4 h-4" /> },
                { label: "Appointment", icon: <Calendar className="w-4 h-4" /> },
                { label: "Review", icon: <CheckCircle className="w-4 h-4" /> }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center justify-center space-y-1 ${
                    currentStep === idx + 1 ? "text-indigo-400 font-semibold" : "text-slate-500"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${currentStep === idx + 1 ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800"}`}>
                    {step.icon}
                  </div>
                  <span className="hidden sm:inline text-[10px]">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-8 sm:p-12">
          
          {/* STEP 1: TRAVEL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Where are you traveling to?</h2>
                <p className="text-slate-500 text-sm">Tell us about your visa requirements.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Destination Country</label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  >
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United States">United States (USA)</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Visa Category</label>
                  <select
                    name="visaType"
                    value={formData.visaType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  >
                    <option value="schengen">Schengen Visitor (Tourism/Family/Business)</option>
                    <option value="uk">UK Standard Visitor Visa</option>
                    <option value="usa">US B1/B2 Visa</option>
                    <option value="canada">Canada Temporary Resident Visa (TRV)</option>
                    <option value="other">Other Consultancy</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Date of Travel</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
                <p className="text-slate-500 text-sm">Enter your contact details so our agents can reach you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. John"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Smith"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john.smith@domain.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +44 7911 123456"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nationality / Citizenship</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="e.g. British, Indian, Pakistani"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Status</label>
                  <select
                    name="employment"
                    value={formData.employment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  >
                    <option value="Employed">Employed (Full-time / Part-time)</option>
                    <option value="Self-Employed">Self-Employed (Business owner)</option>
                    <option value="Student">Student (University / School)</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD SIMULATOR */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Document Assessment Upload</h2>
                <p className="text-slate-500 text-sm">Upload drafts of your core documents for our checklist audit (max 5MB each).</p>
              </div>

              {/* Upload Item 1: Passport */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Passport Scan (Mandatory)
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">First & Last details page of your passport.</p>
                  </div>
                  <label className="mt-2 sm:mt-0 cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Upload File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "passport")}
                    />
                  </label>
                </div>
                {files.passport && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indigo-600 font-semibold">
                      <span className="truncate">{files.passport.name}</span>
                      <span>{uploadProgress.passport}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress.passport}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Item 2: Bank Statement */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Proof of Funds (Optional for now)
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Bank statements from the last 3 months.</p>
                  </div>
                  <label className="mt-2 sm:mt-0 cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Upload File
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "bankStatement")}
                    />
                  </label>
                </div>
                {files.bankStatement && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indigo-600 font-semibold">
                      <span className="truncate">{files.bankStatement.name}</span>
                      <span>{uploadProgress.bankStatement}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress.bankStatement}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Item 3: Accomodation */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Accommodation / Flight Reservation (Optional)
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Hotel vouchers, host invitations, or flight tickets.</p>
                  </div>
                  <label className="mt-2 sm:mt-0 cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Upload File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "accommodation")}
                    />
                  </label>
                </div>
                {files.accommodation && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indigo-600 font-semibold">
                      <span className="truncate">{files.accommodation.name}</span>
                      <span>{uploadProgress.accommodation}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress.accommodation}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: BOOK CONSULTATION APPOINTMENT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Schedule Visa Interview & Document Check</h2>
                <p className="text-slate-500 text-sm">Select a date and time for your online consultation with a visa specialist.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time Slot (UK Time)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setFormData(prev => ({ ...prev, appointmentTime: slot }))}
                        className={`py-3 px-2 border rounded-xl text-xs font-semibold transition-all ${
                          formData.appointmentTime === slot
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start space-x-3 mt-4">
                <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-800 leading-relaxed">
                  <span className="font-bold">What happens in the consultation?</span> Our visa specialist reviews your documents line-by-line, corrects potential reasons for refusal in your bank statements/employment letters, drafts your embassy cover letter, and books your official biometrics appointment.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {currentStep === 5 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Application</h2>
                <p className="text-slate-500 text-sm">Please verify your details before submitting.</p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium w-1/3">Target Destination</td>
                      <td className="px-6 py-4 text-slate-800 font-bold">{formData.destination}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Visa Category</td>
                      <td className="px-6 py-4 text-slate-800 font-semibold uppercase">{formData.visaType}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Travel Date</td>
                      <td className="px-6 py-4 text-slate-800">{new Date(formData.travelDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Client Name</td>
                      <td className="px-6 py-4 text-slate-800">{formData.firstName} {formData.lastName}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Contact Details</td>
                      <td className="px-6 py-4 text-slate-800">
                        <div>{formData.email}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{formData.phone}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Consultation Date</td>
                      <td className="px-6 py-4 text-slate-800 font-semibold text-indigo-600">
                        {new Date(formData.appointmentDate).toLocaleDateString()} at {formData.appointmentTime}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-slate-50/50 text-slate-500 font-medium">Consultancy Charge</td>
                      <td className="px-6 py-4 text-indigo-600 font-bold text-base">
                        {formData.visaType === "schengen" ? "£99" : formData.visaType === "usa" ? "£199" : "£149"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Disclaimer Agreement */}
              <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/30 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                  I understand that <span className="font-bold text-slate-800">GlobalPath Visa</span> is an independent document audit consultancy. I agree to pay the consultancy fee for document checking, cover letter drafting, and appointment handling, and understand that official government visa fees are separate.
                </label>
              </div>

              {/* Button controllers inside form */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center text-slate-500 font-semibold hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Submission...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Application
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: SUCCESS AND TRACKING GENERATION */}
          {currentStep === 6 && (
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full border-4 border-emerald-100 animate-bounce">
                <Check className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Application Submitted!</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  Your visa file assessment has been registered. A visa specialist has been assigned to audit your documents.
                </p>
              </div>

              {/* Tracking ID card */}
              <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Your Live Tracking ID</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-indigo-400 tracking-widest my-2 select-all">
                  {trackingId}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Use this ID to track your document audit updates, biometrics booking status, and embassy feedback.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 max-w-md mx-auto p-4 rounded-xl text-left space-y-1 text-xs">
                <div className="font-semibold text-slate-700">What is next?</div>
                <div className="text-slate-500">1. A payment invoice has been sent to <span className="font-bold text-slate-700">{formData.email}</span>.</div>
                <div className="text-slate-500">2. Our specialist will call you on <span className="font-bold text-slate-700">{new Date(formData.appointmentDate).toLocaleDateString()}</span> at <span className="font-bold text-slate-700">{formData.appointmentTime}</span>.</div>
              </div>

              {/* Next Steps CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => navigate(`/track?id=${trackingId}`)}
                  className="px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md text-sm"
                >
                  Track Status Now
                </button>
                <button
                  onClick={() => {
                    // Reset state
                    setFormData({
                      destination: "France",
                      visaType: "schengen",
                      travelDate: "",
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      nationality: "United Kingdom",
                      employment: "Employed",
                      appointmentDate: "",
                      appointmentTime: "",
                      agreeToTerms: false,
                    });
                    setFiles({ passport: null, bankStatement: null, accommodation: null });
                    setCurrentStep(1);
                  }}
                  className="px-6 py-3.5 border border-slate-300 hover:border-slate-800 font-semibold rounded-xl transition-all text-slate-600 hover:text-slate-800 text-sm"
                >
                  Apply for Another Visa
                </button>
              </div>
            </div>
          )}

          {/* Bottom Button Controllers (for steps 1-4) */}
          {currentStep <= 4 && (
            <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center text-slate-500 font-semibold hover:text-slate-900 transition-colors disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all group"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Apply;
