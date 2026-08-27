import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/password/forgot', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-mint-dark" />
        <h1 className="font-display text-2xl font-700">Check your email</h1>
        <p className="mt-2 text-slate-soft">We've sent a password reset link to <strong>{email}</strong>. It expires in 30 minutes.</p>
        <Link to="/login" className="btn-primary mt-6">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-1 font-display text-3xl font-700">Forgot password?</h1>
      <p className="mb-8 text-slate-soft">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-soft">
        <Link to="/login" className="font-semibold text-brand hover:underline">Back to Login</Link>
      </p>
    </div>
  );
}
