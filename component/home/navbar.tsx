'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='pr-[32px] dark:bg-[#28272A] bg-white border-b border-[#D1D5DB]'>
      <div className="px-[32px]  md:px-[80px]  dark:bg-[#28272A] bg-white">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={64}
                height={64}
                priority
              />
            </Link>
          </div>

         
         

          {/* Profile Picture */}
          <div className="hidden md:flex md:items-center">
             <div className="hidden md:flex md:items-center md:gap-[24px] md:mr-[24px]">
            <Link
              href="/"
              className={`font-inter font-medium text-sm leading-[14px] tracking-[-0.5px] transition-colors ${
                isActive('/')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-[#1F2937] dark:text-[#FFFFFF] hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={` font-inter font-medium text-sm leading-[14px] tracking-[-0.5px] transition-colors ${
                isActive('/dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-[#1F2937] dark:text-[#FFFFFF]  hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
          </div>
          <Link  href="/company-profile">
          
          <div className="h-[32px] w-[32px] rounded-full overflow-hidden border-1 border-gray-200">
              <Image
                src="/profile.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
            
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Profile Picture */}
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src="/profile.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2  font-inter font-medium text-sm leading-[14px] tracking-[-0.5px] ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2  font-inter font-medium text-sm leading-[14px] tracking-[-0.5px] ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}