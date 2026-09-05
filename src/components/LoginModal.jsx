import React, { useState } from 'react';
import { X, Building2, Lock, User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [orgCode, setOrgCode] = useState('OIL-INDIA-HSSE');
  const [username, setUsername] = useState('hse.director@oilindia.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Organization Login
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Oil India Limited HSSE Portal
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Authentication Successful
            </h4>
            <p className="text-xs text-slate-400">
              Redirecting to Enterprise Safety Intelligence Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Organization Unit Code
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Official HSSE Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Password / SSO Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Safety Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Encrypted SAML 2.0 / Enterprise Authentication</span>
          </span>
        </div>
      </div>
    </div>
  );
}