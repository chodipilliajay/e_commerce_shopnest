import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Shipping', 'Confirm', 'Payment'];

export default function CheckoutSteps({ active }) {
  return (
    <div className="mx-auto mb-10 flex max-w-md items-center justify-between">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${i < active ? 'bg-mint text-white' : i === active ? 'bg-brand text-white' : 'bg-ink/10 text-ink/40'}`}>
              {i < active ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-xs ${i === active ? 'font-semibold text-ink' : 'text-slate-soft'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < active ? 'bg-mint' : 'bg-ink/10'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}
