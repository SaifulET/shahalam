'use client';

import { Phone, Mail, MapPin, Globe, Users, Briefcase, TrendingUp, UserCheck } from 'lucide-react';
import Image from 'next/image';

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-[36px] md:px-[80px]">
      <div className="">
        <h1 className="font-inter font-semibold text-2xl leading-8 text-gray-600 tracking-[-0.5px] mb-[62px] dark:text-[#FFFFFF]">Company Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[145px]">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-600 dark:text-[#FFFFFF]">TechFlow Solutions</h2>
                <p className="text-gray-600 text-sm md:text-base dark:text-[#FFFFFF]">Enterprise Software Solutions</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 ">
                <div className='bg-[#E5E7EB] p-[10px] rounded-lg'><Phone className="w-5 h-5 text-gray-600 flex-shrink-0" /></div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-[#FFFFFF]">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">Primary Contact</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 ">
                <div className='bg-[#E5E7EB] p-[10px] rounded-lg'><Mail className="w-5 h-5 text-gray-600 flex-shrink-0" /></div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-[#FFFFFF]">contact@techflow.com</p>
                  <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">Business Email</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 ">
                <div className='bg-[#E5E7EB] p-[10px] rounded-lg'><MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" /></div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-[#FFFFFF]">San Francisco, CA</p>
                  <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">Headquarters</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 ">
                <div className='bg-[#E5E7EB] p-[10px] rounded-lg'><Globe className="w-5 h-5 text-gray-600 flex-shrink-0" /></div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-[#FFFFFF]">www.techflow.com</p>
                  <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">Website</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 ">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-[#FFFFFF]">wsl.realestate</p>
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3 text-gray-600 dark:text-[#FFFFFF]">About Company</h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base  dark:text-[#FFFFFF]">
                TechFlow Solutions is a leading provider of enterprise software solutions, specializing in 
                workflow automation and digital transformation. Founded in 2018, we help businesses 
                streamline their operations through innovative technology.
              </p>
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6  mb-[300px]">
            {/* Employees */}
            <div className="border border-[#F3F4F6] dark:bg-[#28272A] bg-white rounded-lg p-6 h-[166px]">
              <div className="w-12 h-12 bg-[#DBEAFE] dark:bg-[#E5E7EB] rounded-lg flex items-center justify-center ">
                <Users className="w-6 h-6 text-[#2563EB]" />
              </div>
              <p className="font-inter text-gray-600 dark:text-[#FFFFFF] font-semibold text-2xl leading-8 tracking-[-0.5px] mb-1">127</p>
              <p className="text-[#6B7280] font-inter font-normal text-xs leading-4 tracking-[-0.2px]">Employees</p>
            </div>

            {/* Active Projects */}
            <div className="border border-[#F3F4F6] bg-white dark:bg-[#28272A] rounded-lg p-6 h-[166px]">
              <div className="w-12 h-12 bg-[#FFEDD5] rounded-lg flex items-center justify-center ">
                <Briefcase className="w-6 h-6 text-[#EA580C]" />
              </div>
              <p className="font-inter font-semibold text-gray-600 dark:text-[#FFFFFF] text-2xl leading-8 tracking-[-0.5px] mb-1">89</p>
              <p className="text-[#6B7280] font-inter font-normal text-xs leading-4 tracking-[-0.2px]">Active Projects</p>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}