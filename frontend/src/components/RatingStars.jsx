import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, size = 14, showValue = false }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(value) ? 'fill-sun text-sun' : 'fill-ink/10 text-ink/10'}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-slate-soft">({value.toFixed(1)})</span>}
    </div>
  );
}
