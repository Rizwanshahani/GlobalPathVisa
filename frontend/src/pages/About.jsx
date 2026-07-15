import { Shield, Compass, ShieldCheck } from "lucide-react";

const About = () => {
  const values = [
    { title: "Precision Auditing", text: "Every bank statement, tax slip, and employment certificate is reviewed line-by-line to prevent visa refusal.", icon: <ShieldCheck className="text-indigo-600" size={24} />, bg: "bg-indigo-50" },
    { title: "Client Security", text: "Your passports and financial drafts are kept under military-grade encryption and treated with absolute confidentiality.", icon: <Shield className="text-indigo-600" size={24} />, bg: "bg-indigo-50" },
    { title: "Embassy Coordination", text: "Our team maintains continuous contact with TLS, VFS, and BLS agencies to monitor booking queues.", icon: <Compass className="text-indigo-600" size={24} />, bg: "bg-indigo-50" }
  ];

  const team = [
    { name: "Julian Sterling", role: "Founder & Chief Visa Specialist", avatar: "JS", desc: "Former embassy administrative consultant with 12+ years of legal visa filing experience." },
    { name: "Amara Okeke", role: "Schengen Policy Auditor", avatar: "AO", desc: "Coordinates Schengen compliance, financial audits, and multi-entry eligibility." },
    { name: "Leo Sterling", role: "Embassy Operations Lead", avatar: "LS", desc: "Manages fast-track appointments and client cover letter drafting workflows." }
  ];

  return (
    <div className="pt-28 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        
        {/* Vision Statement */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Profile</span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Building Global Pathways <br />
            Since 2026
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            At GlobalPath Visa, we believe that borders shouldn't prevent family reunions, academic paths, or international business projects. Our London-based team of consultants works with applicant files to secure approvals.
          </p>
        </div>

        {/* Pillars */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Core Operating Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow space-y-4 text-left">
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base">{v.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company History */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-md text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why GlobalPath was Founded</h2>
            <p className="text-slate-650 text-xs leading-relaxed">
              GlobalPath Visa was founded in London to address the growing complexity of visa application portals. We noticed that thousands of tourists, students, and business travellers faced unnecessary refusals due to clerical errors, format mistakes, or minor financial presentation issues.
            </p>
            <p className="text-slate-650 text-xs leading-relaxed">
              We decided to combine database tracking, automated slot monitoring, and legal expert auditing into a single agency. Today, we handle over 400+ active client files every month, maintaining a verified success rate of 99.2%.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=80"
              alt="Visa travel airplane"
              className="rounded-2xl w-full h-56 object-cover border border-slate-150"
            />
          </div>
        </div>

        {/* Team Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Meet our Specialists</h2>
            <p className="text-xs text-slate-500 font-semibold">The consultants ensuring your documents pass consular inspection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md text-center flex flex-col items-center hover:scale-[1.01] transition-transform">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mb-4">
                  {t.avatar}
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                <span className="text-xs text-indigo-600 font-bold mb-3">{t.role}</span>
                <p className="text-slate-550 text-xs leading-relaxed max-w-[200px]">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
