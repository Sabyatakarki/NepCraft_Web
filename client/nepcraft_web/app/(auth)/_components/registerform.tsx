'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev: any) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validate = () => {
    let err: any = {};

    if (!form.fullName.trim()) err.fullName = 'Full name is required';
    if (!form.email.trim()) err.email = 'Email address is required';
    if (!form.phoneNumber.trim()) err.phoneNumber = 'Phone number is required';
    if (!form.password.trim()) err.password = 'Password is required';
    if (!form.confirmPassword.trim()) err.confirmPassword = 'Please confirm your password';

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      err.confirmPassword = "Passwords don't match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message || 'Something went wrong. Please try again.' });
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setErrors({ api: 'Unable to connect to the server. Please check your connection.' });
    }

    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login coming soon 🚀`);
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border ${
      hasError ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8D9CA] bg-white/80'
    } px-4 py-3 pl-11 text-sm text-[#3D251E] placeholder:text-[#A8928A] outline-none transition-all duration-200 hover:border-[#C87A53]/50 focus:bg-white focus:border-[#C87A53] focus:ring-4 focus:ring-[#C87A53]/15 shadow-2xs`;

  return (
    <div className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto px-1 py-2 flex flex-col justify-center scrollbar-thin">

      {/* HEADER SECTION */}
      <div className="mb-6">
  
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#C87A53]">
          Create Account
        </h2>
        <p className="text-xs text-[#8C7B75] mt-1.5 leading-relaxed">
          Join NepCraft to discover authentic handmade treasures and support local artisans.
        </p>
      </div>

      {/* ALERTS */}
      {errors.api && (
        <div className="mb-4 flex items-center gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{errors.api}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>Account created successfully! Redirecting to login...</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Full Name */}
        <div>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 text-[#A8928A]" size={18} />
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              disabled={success}
              className={inputClass(!!errors.fullName)}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] font-medium text-rose-500 mt-1 pl-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-[#A8928A]" size={18} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              disabled={success}
              className={inputClass(!!errors.email)}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-rose-500 mt-1 pl-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 text-[#A8928A]" size={18} />
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              disabled={success}
              className={inputClass(!!errors.phoneNumber)}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-[11px] font-medium text-rose-500 mt-1 pl-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-[#A8928A]" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={success}
              className={inputClass(!!errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-[#A8928A] hover:text-[#3D251E] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] font-medium text-rose-500 mt-1 pl-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-[#A8928A]" size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              disabled={success}
              className={inputClass(!!errors.confirmPassword)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-3.5 text-[#A8928A] hover:text-[#3D251E] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-rose-500 mt-1 pl-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={success || loading}
          className="w-full mt-2 bg-[#C87A53] hover:bg-[#B36842] text-white py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#C87A53]/20 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : success ? (
            'Redirecting...'
          ) : (
            'Create Account'
          )}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-xs text-[#8C7B75] pt-1">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C87A53] font-semibold hover:underline">
            Log in
          </Link>
        </p>

        {/* SOCIAL DIVIDER */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-[#E8D9CA]" />
          <span className="absolute bg-[#FFFDFB] px-3 text-[11px] text-[#A8928A] font-medium uppercase tracking-wider">
            or sign up with
          </span>
        </div>

        {/* SOCIAL BUTTONS */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="flex-1 flex items-center justify-center gap-2 border border-[#E8D9CA] bg-white rounded-xl py-2.5 hover:bg-[#FAF7F2] hover:border-[#C87A53]/40 transition-colors shadow-2xs"
          >
            <FaFacebookF className="text-[#1877F2] text-sm" />
            <span className="text-xs font-medium text-[#3D251E]">Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="flex-1 flex items-center justify-center gap-2 border border-[#E8D9CA] bg-white rounded-xl py-2.5 hover:bg-[#FAF7F2] hover:border-[#C87A53]/40 transition-colors shadow-2xs"
          >
            <FaGoogle className="text-[#EA4335] text-sm" />
            <span className="text-xs font-medium text-[#3D251E]">Google</span>
          </button>
        </div>

      </form>
    </div>
  );
}