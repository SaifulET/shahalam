'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    try {
      // Handle resend code logic here
      console.log('Resending verification code...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Verification code resent to your email!');
    } catch (error) {
      console.error('Failed to resend code:', error);
      alert('Failed to resend code. Please try again.');
    }
  };
const router= useRouter()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      alert('Please enter the complete 4-digit code');
      return;
    }

    setIsSubmitting(true);
router.push("/auth/set-new-password")
    
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

      {/* Verify OTP Card */}
      <div className="relative z-10 w-[720px]">
        <div className="bg-[#89C8FF] rounded-3xl p-[71px]">
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

          {/* Title */}
          <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-4">
            Verify OTP
          </h1>

          {/* Description */}
          <p className="text-white text-center text-sm sm:text-base mb-8 leading-relaxed">
            Please check your email. We have sent a code to contact @gmail.com
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-bold bg-white text-[#0088FF] rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="-"
                />
              ))}
            </div>

            {/* Didn't receive code & Resend */}
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-white">Didnt receive code?</span>
              <button
                type="button"
                onClick={handleResend}
                className="text-[#F2DFA7] hover:underline transition-all font-medium"
              >
                Resend
              </button>
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F2DFA7] text-[#0088FF] font-semibold py-4 rounded-xl hover:bg-[#e8d399] active:scale-[0.98] transition-all shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Send Code'}
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