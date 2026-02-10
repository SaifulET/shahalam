'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';



export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberPassword, setRememberPassword] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const route= useRouter()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data); // log the response for debugging
    // Get accessToken and user from response
    const { accessToken, user } = res.data;

    // Update Zustand store
    useAuthStore.getState().login(user, accessToken);

    // Redirect to dashboard or home
    route.push("/"); // or "/"
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "An error occurred");
  }
};


  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/authbg.jpg" // Replace with your image path
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-[720px]">
        <div className="bg-[#89C8FF] rounded-3xl  p-[71px]">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
              <Image
                src="/logo.svg" // Replace with your logo path
                alt="حرم Real Estate Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base sm:text-lg"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base sm:text-lg pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Password & Forgot Password */}
            <div className="flex items-center justify-between text-sm sm:text-base">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-[#F8FAFB] bg-transparent checked:bg-[#F8FAFB]  cursor-pointer transition-all"
                />
                <span className="ml-2 text-[#F8FAFB] select-none">
                  Remember password
                </span>
              </label>
              <Link
                href="/auth/forget-password"
                className="text-[#F2DFA7] hover:underline transition-all"
              >
                Forget password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#F2DFA7] text-[#0088FF] font-semibold py-4 rounded-xl hover:bg-[#e8d399] active:scale-[0.98] transition-all shadow-lg text-base sm:text-lg"
            >
              Sign In
            </button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
           
          </form>
        </div>
      </div>
    </div>
  );
}