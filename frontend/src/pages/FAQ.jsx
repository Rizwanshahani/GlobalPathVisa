import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqData = [
    {
      q: "Is GlobalPath Visa an official embassy or visa center?",
      a: "No. GlobalPath Visa is an independent document audit consultancy. We are not affiliated with VFS Global, BLS, TLScontact, or any government embassy. We assist travellers by reviewing their financial records, designing cover letters, and coordinating biometrics appointments to minimize rejections."
    },
    {
      q: "How long does a Schengen Visa take to process?",
      a: "Typically, Schengen visa processing takes 10 to 15 business days from the date of your biometrics appointment at the visa center (VFS/TLS/BLS). During peak travel seasons (summer and holidays), processing times can extend to 30 days. We recommend beginning your assessment 4-6 weeks before travel."
    },
    {
      q: "Can you guarantee that my visa will be approved?",
      a: "No visa consultancy can legally guarantee a visa approval. Consular officers at the respective embassy hold absolute authority to grant or reject applications. Our role is to audit your files to ensure they comply 100% with the strict consular guidelines, which historically gives our clients a 99.2% success rate."
    },
    {
      q: "What is your refund policy if my visa is refused?",
      a: "In the rare event that your visa is refused after using our document audit service, we offer a 50% refund of our consultancy fee. This refund applies only if the refusal was due to documentation errors that we certified. It does not apply to rejections due to criminal history, falsified documents, or embassy delays."
    },
    {
      q: "What is the difference between your consultancy fee and the embassy fee?",
      a: "Our consultancy fee (starting from £99) covers our expert document checks, cover letter design, travel itinerary organization, and biometrics scheduling assistance. The official embassy visa fee (e.g. €90 for Schengen, £115 for UK) is a government tax and is paid separately to the consulate or their partner visa application center."
    },
    {
      q: "How does the Live File Tracking work?",
      a: "Once you submit a visa assessment request, you will receive a unique reference ID (e.g., GP-739281). You can type this reference number on our 'Track Application' page to view real-time updates of your file status, document audits, and biometrics appointment confirmation details."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <HelpCircle size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Find answers to common questions regarding visa applications, document checking, booking queues, and fees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {faqData.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 md:p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-55 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Center CTA */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <h3 className="font-bold text-lg text-white">Still have questions or need custom support?</h3>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
            Our visa consultants are available via WhatsApp or email for urgent application assistance.
          </p>
          <div className="pt-2">
            <Link 
              to="/contact" 
              className="inline-block text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Contact Visa Specialist
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
