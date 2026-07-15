import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, CheckCircle2, Clock, Landmark, Compass, ShieldAlert, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

// Default Sample Application
const sampleApplication = {
  trackingId: "GP-SAMPLE123",
  destination: "Italy",
  visaType: "schengen",
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+44 7700 900077",
  travelDate: "2026-09-15",
  appointmentDate: "2026-07-28",
  appointmentTime: "10:30 AM",
  status: "Appointment Scheduled",
  updatedAt: "2026-07-12",
  timeline: [
    { status: "Submitted", description: "Online registration and draft documents submitted successfully.", date: "2026-07-10", completed: true },
    { status: "Document Audit", description: "GlobalPath specialist reviewed financials and verified travel insurance meets Schengen criteria.", date: "2026-07-11", completed: true },
    { status: "Appointment Booking", description: "Biometrics appointment successfully secured at VFS Italy, London (Joint Visa Application Centre).", date: "2026-07-12", completed: true },
    { status: "Embassy Submission", description: "Awaiting applicant to attend biometrics. Documents will be submitted to the Embassy same-day.", date: "Pending", completed: false },
    { status: "Passport Dispatched", description: "Consular decision complete. Passport returning via secure Royal Mail courier.", date: "Pending", completed: false }
  ]
};

const Track = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") || "";

  const [inputVal, setInputVal] = useState(queryId);
  const [loading, setLoading] = useState(false);
  const [appDetails, setAppDetails] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);

    // Simulate database lookup
    setTimeout(() => {
      // 1. Check for sample ID
      if (id.trim().toUpperCase() === "GP-SAMPLE123") {
        setAppDetails(sampleApplication);
        setLoading(false);
        return;
      }

      // 2. Check localStorage
      const localApps = JSON.parse(localStorage.getItem("globalpath_visas") || "[]");
      const found = localApps.find(app => app.trackingId.toUpperCase() === id.trim().toUpperCase());

      if (found) {
        setAppDetails(found);
      } else {
        setAppDetails(null);
        toast.error("Application ID not found");
      }
      setLoading(false);
    }, 1200);
  };

  // Trigger search when queryId changes
  useEffect(() => {
    if (queryId) {
      const timer = setTimeout(() => {
        handleSearch(queryId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [queryId]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: inputVal.trim() });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Search Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center space-y-6">
          <span className="text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full text-xs">
            Live File Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Visa File
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-sm sm:text-base">
            Enter your unique GlobalPath Tracking Reference number (e.g., GP-XXXXXX) to view real-time document audits and appointment booking timelines.
          </p>

          {/* Search bar */}
          <form onSubmit={onFormSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Tracking ID (e.g. GP-SAMPLE123)"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-base uppercase tracking-wider text-slate-800"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
            </button>
          </form>

          {/* Helper tip */}
          <div className="text-xs text-slate-400">
            Don't have a tracking ID? Search for <button onClick={() => { setInputVal("GP-SAMPLE123"); setSearchParams({ id: "GP-SAMPLE123" }); }} className="text-indigo-600 font-semibold underline cursor-pointer">GP-SAMPLE123</button> to view the demo experience.
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-3xl p-16 shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 text-sm font-semibold">Retrieving file record from GlobalPath Database...</p>
          </div>
        )}

        {/* DETAILS STATE */}
        {!loading && searched && appDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Application Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6 lg:col-span-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Destination
                </span>
                <div className="text-xl font-bold text-slate-900 flex items-center">
                  <Compass className="w-5 h-5 text-indigo-500 mr-2" />
                  {appDetails.destination}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Visa Category
                </span>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg uppercase">
                  {appDetails.visaType}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Applicant</span>
                  <span className="font-semibold text-slate-800">{appDetails.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Target Travel Date</span>
                  <span className="font-semibold text-slate-800">{new Date(appDetails.travelDate).toLocaleDateString()}</span>
                </div>
                {appDetails.appointmentDate && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">Biometrics Appointment</span>
                    <span className="font-semibold text-indigo-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(appDetails.appointmentDate).toLocaleDateString()} at {appDetails.appointmentTime}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-3">
                <div className="text-xs font-bold text-slate-700">Need Help with this file?</div>
                <a href={`mailto:support@globalpathvisa.co.uk?subject=Inquiry for ${appDetails.trackingId}`} className="flex items-center text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  support@globalpathvisa.co.uk
                </a>
                <div className="flex items-center text-xs text-slate-500">
                  <Phone className="w-4 h-4 mr-2" />
                  +44 207 946 0998
                </div>
              </div>
            </div>

            {/* Right Column: Visual Timeline Stepper */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl text-white lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-mono tracking-wide">Tracking Reference</span>
                  <h2 className="text-lg font-bold font-mono text-indigo-400 uppercase">{appDetails.trackingId}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Current Status</span>
                  <span className="text-sm font-bold text-emerald-400">{appDetails.status}</span>
                </div>
              </div>

              {/* TIMELINE LIST */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {appDetails.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    {/* Status Circle Dot */}
                    <div className="absolute -left-[24px] top-1 z-10 flex items-center justify-center">
                      {step.completed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                        </div>
                      ) : appDetails.status === step.status ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 border-4 border-slate-950 flex items-center justify-center animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-white shrink-0" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Text Content */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-bold text-base ${step.completed ? "text-white" : "text-slate-400"}`}>
                          {step.status}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          step.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}>
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Tip for application */}
              <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-200">Note:</span> Visual timeline updates inside 24 hours of embassy document drop-off or biometrics verification. If your appointment was completed today, please check back tomorrow afternoon for shipping tracking updates.
              </div>

            </div>
          </div>
        )}

        {/* NOT SEARCHED / BLANK STATE */}
        {!loading && (!searched || !appDetails) && (
          <div className="bg-white rounded-3xl p-12 sm:p-16 shadow-xl border border-slate-100 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 rounded-full">
              <Landmark className="w-8 h-8" />
            </div>
            {searched ? (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-red-500 mr-2 shrink-0" />
                  Reference ID Not Found
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  We couldn't locate any records matching that ID. Please check the spelling, make sure it matches the pattern <span className="font-mono">GP-XXXXXX</span>, or check local storage.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Awaiting Search Query</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Your tracking details will display here as soon as you enter a valid reference ID.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Track;
