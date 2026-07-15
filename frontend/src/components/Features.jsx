import { Headphones, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Features = () => {
  const items = [
    {
      icon: <Truck className="h-6 w-6 text-pink-600" />,
      title: "Complimentary Delivery",
      description: "Enjoy free premium shipping on all orders over $50",
      bg: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
      title: "Encrypted Transactions",
      description: "100% secure payment systems with standard SSL security",
      bg: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: <Headphones className="h-6 w-6 text-blue-600" />,
      title: "Expert Assistance",
      description: "Our customer service specialists are online 24/7",
      bg: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-teal-600" />,
      title: "Hassle-Free Returns",
      description: "Not satisfied? Return or exchange within 30 days",
      bg: "bg-teal-50 dark:bg-teal-950/20"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-y border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 shadow-3xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 group"
            >
              <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-850 dark:text-white text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
