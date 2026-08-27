import React from 'react';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="mb-4 font-display text-3xl font-700">About ShopNest</h1>
      <p className="mb-6 leading-relaxed text-ink/70">
        ShopNest is an online marketplace bringing together electronics, fashion, home essentials, books, sports gear
        and beauty products — all in one nest. We're built for shoppers who want quality, fair prices, and a smooth
        experience from browsing to delivery.
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          ['Our Mission', 'Making online shopping simple, transparent, and genuinely enjoyable.'],
          ['Quality First', 'Every product is chosen with care — no filler, no clutter.'],
          ['Fast & Secure', 'Quick delivery and secure Razorpay checkout, every time.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl2 border border-ink/10 bg-white p-5">
            <h3 className="mb-2 font-display font-700">{title}</h3>
            <p className="text-sm text-ink/70">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
