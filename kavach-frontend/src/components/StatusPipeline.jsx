import { Check } from 'lucide-react';

export default function StatusPipeline({ status, className = '' }) {
  const steps = ['Registered', 'Confirmed', 'Attended', 'Certified'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= currentIndex
                  ? 'bg-safetyLime text-brandDark'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i <= currentIndex ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 mx-1 ${
                i < currentIndex ? 'bg-safetyLime' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
