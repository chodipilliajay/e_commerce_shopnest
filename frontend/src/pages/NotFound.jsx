import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-700 text-brand">404</h1>
      <p className="mt-3 text-lg font-medium">Page not found</p>
      <p className="mt-1 text-sm text-slate-soft">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
