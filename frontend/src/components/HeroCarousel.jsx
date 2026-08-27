import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    tag: '🔥 Up to 60% off this week',
    title: 'Everything you need, in one nest.',
    subtitle: 'Electronics, fashion, home essentials and more — hand-picked, fairly priced.',
    cta: 'Start Shopping',
    to: '/products',
    image: 'electronics,shopping',
    from: '#14162B',
    to2: '#2A2E52',
  },
  {
    tag: '🥦 New in',
    title: 'Farm-fresh fruits & vegetables.',
    subtitle: 'Straight from the farm to your doorstep — crisp, fresh, and delivered fast.',
    cta: 'Shop Fresh Produce',
    to: '/products?category=Fruits%20%26%20Vegetables',
    image: 'fresh-vegetables,farmers-market',
    from: '#0F3D2E',
    to2: '#1B5E42',
  },
  {
    tag: '👗 Trending now',
    title: 'Refresh your wardrobe.',
    subtitle: 'The latest fashion arrivals, styled for every season.',
    cta: 'Explore Fashion',
    to: '/products?category=Fashion',
    image: 'fashion,street-style',
    from: '#3D1F3D',
    to2: '#5C2A5C',
  },
  {
    tag: '🏠 Home refresh',
    title: 'Make your space feel new.',
    subtitle: 'Kitchen, decor & essentials for a home you love coming back to.',
    cta: 'Shop Home & Kitchen',
    to: '/products?category=Home%20%26%20Kitchen',
    image: 'home-decor,interior',
    from: '#1F2E3D',
    to2: '#2A445C',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);
  const prev = () => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[active];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(120deg, ${slide.from}, ${slide.to2})`, transition: 'background 0.8s ease' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-mint/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div className="flex flex-col justify-center">
          <span key={`tag-${active}`} className="mb-4 inline-flex w-fit animate-[fadeIn_0.6s_ease] items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-sun">
            {slide.tag}
          </span>
          <h1 key={`title-${active}`} className="animate-[fadeIn_0.6s_ease] font-display text-4xl font-700 leading-tight text-white md:text-6xl">
            {slide.title}
          </h1>
          <p key={`subtitle-${active}`} className="mt-5 max-w-md animate-[fadeIn_0.6s_ease] text-white/60">
            {slide.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={slide.to} className="btn-primary">
              {slide.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <img
            key={`img-${active}`}
            src={`https://loremflickr.com/560/420/${slide.image}?lock=${active + 500}`}
            alt=""
            className="h-[340px] w-[440px] animate-[fadeIn_0.7s_ease] rounded-xl2 object-cover shadow-card-hover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 pb-8 md:px-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-brand' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={prev} className="rounded-full border border-white/20 p-2 text-white hover:bg-white/10" aria-label="Previous slide"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={next} className="rounded-full border border-white/20 p-2 text-white hover:bg-white/10" aria-label="Next slide"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
