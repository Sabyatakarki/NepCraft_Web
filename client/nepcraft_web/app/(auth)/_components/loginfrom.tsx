'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err: any = {};

    if (!form.email.trim()) err.email = 'Email is required';
    if (!form.password.trim()) err.password = 'Password is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message || 'Invalid email or password' });
        setLoading(false);
        return;
      }

      // OPTIONAL: store token + user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));

      // redirect after success
      router.push('/home');

    } catch (error) {
      setErrors({ api: 'Server not responding' });
    }

    setLoading(false);
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50/40 px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:border-[#C87A53] focus:ring-4 focus:ring-[#C87A53]/10';

  return (
    <div className="w-full max-w-md">

      {/* Header */}
      <h2 className="text-3xl font-bold text-[#C87A53]">
        Welcome Back
      </h2>

      <p className="text-sm text-gray-500 mt-2 mb-6">
        Login to continue exploring NepCraft.
      </p>

      {/* API Error */}
      {errors.api && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass}
              disabled={loading}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              ⚠ {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={inputClass}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              ⚠ {errors.password}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C87A53] hover:bg-[#B36842] text-white py-3.5 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Forgot password */}
        <p className="text-center text-xs text-gray-500 mt-2">
          Forgot password?
        </p>

        {/* Signup */}
        <p className="text-center text-xs text-gray-500 mt-2">
          Don’t have an account?{' '}
          <Link href="/register" className="text-[#C87A53] font-semibold">
            Create one
          </Link>
        </p>

      </form>
    </div>
  );
}