'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
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
  };

  const validate = () => {
    let err: any = {};

    if (!form.fullName.trim()) err.fullName = 'Required';
    if (!form.email.trim()) err.email = 'Required';
    if (!form.phoneNumber.trim()) err.phoneNumber = 'Required';
    if (!form.password.trim()) err.password = 'Required';
    if (!form.confirmPassword.trim()) err.confirmPassword = 'Required';

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
        setErrors({ api: data.message || 'Something went wrong' });
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setErrors({ api: 'Server not responding' });
    }

    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login coming soon 🚀`);
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50/40 px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:border-[#C87A53] focus:ring-4 focus:ring-[#C87A53]/10';

  return (
    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col justify-center">

      <div className="mb-5">
        <h2 className="text-3xl font-bold tracking-tight text-[#C87A53]">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Join NepCraft and explore handcrafted products made with love in Nepal.
        </p>
      </div>

      {errors.api && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {errors.api}
        </div>
      )}

      {success && (
        <div className="mb-3 text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          Account created! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            disabled={success}
            className={inputClass}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={success}
            className={inputClass}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="relative">
          <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            disabled={success}
            className={inputClass}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            disabled={success}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            disabled={success}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-3.5 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={success || loading}
          className="w-full bg-[#C87A53] hover:bg-[#B36842] text-white py-3.5 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Creating...' : success ? 'Redirecting...' : 'Create Account'}
        </button>

        {/* Login */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C87A53] font-semibold">
            Login
          </Link>
        </p>

        {/* Social */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="flex-1 flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50"
          >
            <FaFacebookF className="text-blue-600" />
            <span className="text-xs">Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="flex-1 flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50"
          >
            <FaGoogle className="text-red-500" />
            <span className="text-xs">Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}