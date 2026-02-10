'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForgotPasswordStore } from '@/store/forgotPasswordStore';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
 const setStoreEmail = useForgotPasswordStore((s) => s.setEmail);
  const router= useRouter()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Email is Required');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email is Required');
      return;
    }

    setIsSubmitting(true);

   try {
    const res= await api.post("/auth/forgot-password", { email });
     // log the response for debugging
     
     if(res.status === 200){
    setStoreEmail(email);

    
    router.push("/auth/otp")}
    else{
      setIsSubmitting(false);
      setError(res.data.message || "Failed to send OTP");
    }
   } catch (error:unknown) {
    setIsSubmitting(false);
      setError( "Failed to send OTP");
    
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

      {/* Forgot Password Card */}
      <div className="relative z-10 w-[720px] ">
        <div className="bg-[#89C8FF] rounded-3xl  p-[71px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
              <Image
                src="/logo.svg" // Replace with your logo path
                alt="حرم Real Estate Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-4">
            Forget Password
          </h1>

          {/* Description */}
          <p className="text-white text-center text-sm sm:text-base mb-8 leading-relaxed">
            Enter your email address to get a verification code for resetting your password.
          </p>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="mostafin@gamil.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error when user types
                }}
                className="w-full px-6 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base sm:text-lg"
              />
              
              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F2DFA7] text-[#0088FF] font-semibold py-4 rounded-xl hover:bg-[#e8d399] active:scale-[0.98] transition-all shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Code'}
            </button>
           

            {/* Back to Login Link */}
            <div className="text-center text-sm sm:text-base">
              <Link
                href="/auth/signin"
                className="text-white hover:text-gray-100 transition-all inline-flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}