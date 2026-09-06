import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Building2,
  Lock,
  Mail,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRESET_ACCOUNTS = [
  { orgId: 'id001', email: 'admin1@gmail.com', password: 'Admin1@123', orgName: 'Oil India Limited' },
  { orgId: 'id002', email: 'admin2@gmail.com', password: 'Admin2@123', orgName: 'Offshore Rig Operations' },
  { orgId: 'id003', email: 'admin3@gmail.com', password: 'Admin3@123', orgName: 'Refinery Processing Center' },
  { orgId: 'id004', email: 'admin4@gmail.com', password: 'Admin4@123', orgName: 'Exploration & Production' },
  { orgId: 'id005', email: 'admin5@gmail.com', password: 'Admin5@123', orgName: 'Gas Transmission' },
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { login } = useAuth();
  
  // Organization ID or Email field
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem('safetyai_remembered_id') || 'id001';
  });
  const [password, setPassword] = useState('Admin1@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('safetyai_remember_me') !== 'false';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Clear messages whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setForgotPasswordNotice(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (account) => {
    setIdentifier(account.orgId);
    setPassword(account.password);
    setErrorMessage('');
    setForgotPasswordNotice(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotPasswordNotice(false);

    const cleanInput = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanInput || !cleanPassword) {
      setErrorMessage('Please enter your Organization ID or Email and Password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine orgId and email from input
      let finalOrgId = cleanInput;
      let finalEmail = cleanInput;

      // Check against preset demo accounts
      const matchedAccount = PRESET_ACCOUNTS.find(
        acc => acc.orgId.toLowerCase() === cleanInput.toLowerCase() || acc.email.toLowerCase() === cleanInput.toLowerCase()
      );

      if (matchedAccount) {
        finalOrgId = matchedAccount.orgId;
        finalEmail = matchedAccount.email;
      } else if (cleanInput.includes('@')) {
        finalEmail = cleanInput;
        // Infer or keep org_id
        finalOrgId = cleanInput.startsWith('admin') 
          ? `id00${cleanInput.replace(/[^0-9]/g, '') || '1'}` 
          : 'id001';
      } else {
        finalOrgId = cleanInput;
        finalEmail = `admin${cleanInput.replace(/[^0-9]/g, '') || '1'}@gmail.com`;
      }

      // Execute login via AuthContext / Backend API
      await login(finalOrgId, finalEmail, cleanPassword);

      // Handle Remember Me preference
      if (rememberMe) {
        localStorage.setItem('safetyai_remembered_id', cleanInput);
        localStorage.setItem('safetyai_remember_me', 'true');
      } else {
        localStorage.removeItem('safetyai_remembered_id');
        localStorage.setItem('safetyai_remember_me', 'false');
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Transition to Dashboard
      setTimeout(() => {
        setIsSuccess(false);
        if (onClose) onClose();
        if (onLoginSuccess) onLoginSuccess();
      }, 700);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Invalid Organization ID, Email, or Password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#09090b] overflow-y-auto lg:overflow-hidden animate-in fade-in duration-300 flex flex-col lg:flex-row select-none">
      
      {/* ================= LEFT HALF: BRIGHT CLEAR IMAGE WITH ACCESSIBLE BADGE ================= */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen bg-[#09090b] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/pic-5.jpg"
            alt="Safety First Petroleum Engineer"
            className="w-full h-full object-cover object-center transform scale-100 filter brightness-100 contrast-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />
        </div>

        {/* Top Left: Logo Badge */}
        <div className="relative z-20">
          <button
            type="button"
            onClick={onClose}
            title="Click to go to main website"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/30 hover:border-amber-400 text-white shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 group"
          >
            <Shield className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-sm font-black font-heading tracking-wide">SafetyAI</span>
            <span className="text-[11px] text-slate-300 font-mono pl-2 border-l border-white/20 group-hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>Main Site</span>
              <span className="text-xs">↗</span>
            </span>
          </button>
        </div>

        {/* Bottom Left: Headline and Subtitle */}
        <div className="relative z-20 space-y-3 max-w-lg mt-auto pt-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
            <span>Enterprise Control Room</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight leading-tight drop-shadow-md">
            Organization Safety Portal
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium drop-shadow-sm">
            Secure authentication required to access SIF Sentinel precursor intelligence and plant telemetry.
          </p>
        </div>

      </div>

      {/* ================= RIGHT HALF: AUTHENTICATION FORM ================= */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white dark:bg-[#09090b] flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
        
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          
          {/* Back to Website Link */}
          <div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-amber-400 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 pt-1">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-950 dark:text-white tracking-tight">
              Organization Login
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Authenticate with your enterprise credentials to enter the dashboard.
            </p>
          </div>

          {/* Error Message Alert (Clear error display) */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Forgot Password Notice */}
          {forgotPasswordNotice && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                For security reset or credential recovery, please contact your Organization HSE Lead or System Administrator at <span className="font-mono text-amber-400">admin@petrosafe.com</span>.
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Authentication Successful
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                Access granted. Loading SIF Sentinel Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              
              {/* 1. Organization ID or Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                  Organization ID or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="id001 or admin1@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#141418] border border-slate-200 dark:border-[#27272e] text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:bg-white dark:focus:bg-[#18181e] focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* 2. Password with Show/Hide Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-[#141418] border border-slate-200 dark:border-[#27272e] text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:bg-white dark:focus:bg-[#18181e] focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-2xs"
                    required
                  />
                  {/* Show/Hide Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Options: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-amber-400 transition-colors font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* 4. Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login to Safety Intelligence</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* 5. Quick Demo Account Selector */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Authorized Demo Accounts:</span>
                  <span className="text-[10px] font-mono text-amber-500">Click to fill</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.orgId}
                      type="button"
                      onClick={() => handleSelectPreset(acc)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                        identifier === acc.orgId || identifier === acc.email
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      title={`${acc.orgName} (${acc.email})`}
                    >
                      {acc.orgId}
                    </button>
                  ))}
                </div>
              </div>

            </form>
          )}

        </div>

        {/* Bottom Security Note */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>256-Bit Encrypted OIL SIF Security Standard</span>
          </div>
        </div>

      </div>

    </div>
  );
}