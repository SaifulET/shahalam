'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Phone, Mail, MapPin, Globe, Users, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Define interfaces for type safety
interface CompanyData {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  joinedDate: string;
  status: string;
  location: string;
  city: string;
  country: string;
  postalCode: string;
  tagline: string;
  website: string;
  description: string;
  instagramLink: string;
  phone: string;
}

interface StatsData {
  totalProjects: number;
  totalEmployees: number;
}

export default function CompanyProfile() {
  const t = useTranslations('companyProfile');
  const locale = useLocale();
  const { user } = useAuthStore();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [stats, setStats] = useState<StatsData>({ totalProjects: 0, totalEmployees: 0 });
  const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
      
       
        setLoading(true);
        // Fetch company details
        const profileRes = await api.get(`/auth/${user?.id}`);
        setCompany(profileRes.data.data);
        
        // Fetch stats
        const statsRes = await api.get(`/auth/totalEmployeeProject/${user?.id}`);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Format phone number display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return t('notProvided');
    return phone;
  };

  // Format location
  const getFullLocation = () => {
    if (!company) return t('locationNotSpecified');
    const parts = [company.location, company.city, company.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : t('locationNotSpecified');
  };

  // Get company name with fallback
  const getCompanyName = () => {
    if (!company?.name) return t('companyNameNotSet');
    return company.name;
  };

  // Get company description with fallback
  const getCompanyDescription = () => {
    if (company?.description) return company.description;
    return t('noDescription');
  };

  // Get tagline with fallback
  const getTagline = () => {
    if (company?.tagline) return company.tagline;
    return t('title');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black px-4 py-8 sm:px-6 lg:px-10 xl:px-20 flex items-center justify-center">
        <div className="text-gray-600 dark:text-[#FFFFFF]">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-8 sm:px-6 lg:px-10 xl:px-20">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="mb-8 text-2xl font-semibold leading-8 tracking-[-0.5px] text-gray-600 dark:text-[#FFFFFF] sm:mb-12">
          {t('title')}
        </h1>
        
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] xl:gap-14 2xl:gap-24">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Company Header */}
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="w-16 h-16 bg-[#E5E7EB] rounded-2xl flex items-center justify-center flex-shrink-0">
                {company?.profileImage ? (
                  <img 
                    src={company.profileImage} 
                    alt={getCompanyName()}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="break-words text-xl md:text-2xl font-bold text-gray-600 dark:text-[#FFFFFF]">
                  {getCompanyName()}
                </h2>
                <p className="text-gray-600 text-sm md:text-base dark:text-[#FFFFFF]">
                  {getTagline()}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {company?.phone && (
                <div className="flex items-start gap-4 p-3">
                  <div className='bg-[#E5E7EB] p-[10px] rounded-lg'>
                    <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-600 dark:text-[#FFFFFF]">
                      {formatPhoneNumber(company.phone)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">{t('primaryContact')}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-3">
                <div className='bg-[#E5E7EB] p-[10px] rounded-lg'>
                  <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="break-words font-medium text-gray-600 dark:text-[#FFFFFF]">
                    {company?.email || t('emailNotProvided')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">{t('businessEmail')}</p>
                </div>
              </div>

              {(company?.location || company?.city || company?.country) && (
                <div className="flex items-start gap-4 p-3">
                  <div className='bg-[#E5E7EB] p-[10px] rounded-lg'>
                    <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-600 dark:text-[#FFFFFF]">
                      {getFullLocation()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">
                      {company?.postalCode ? t('postal', { postalCode: company.postalCode }) : t('location')}
                    </p>
                  </div>
                </div>
              )}

              {company?.website && (
                <div className="flex items-start gap-4 p-3">
                  <div className='bg-[#E5E7EB] p-[10px] rounded-lg'>
                    <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-600 dark:text-[#FFFFFF]">
                      {company.website}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#FFFFFF]">{t('website')}</p>
                  </div>
                </div>
              )}

              {company?.instagramLink && (
                <div className="flex items-start gap-4 p-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-600 dark:text-[#FFFFFF]">
                      {company.instagramLink.replace('https://www.instagram.com/', '@')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* About Company */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3 text-gray-600 dark:text-[#FFFFFF]">{t('aboutCompany')}</h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base dark:text-[#FFFFFF]">
                {getCompanyDescription()}
              </p>
              {company?.joinedDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t('memberSince', { date: new Date(company.joinedDate).toLocaleDateString(locale === 'ar' ? 'ar' : 'en-US') })}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:self-start">
            {/* Employees */}
            <div className="h-auto min-h-[166px] rounded-lg border border-[#F3F4F6] bg-white p-6 dark:bg-[#28272A]">
              <div className="w-12 h-12 bg-[#DBEAFE] dark:bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2563EB]" />
              </div>
              <p className="font-inter text-gray-600 dark:text-[#FFFFFF] font-semibold text-2xl leading-8 tracking-[-0.5px] mb-1">
                {stats.totalEmployees}
              </p>
              <p className="text-[#6B7280] font-inter font-normal text-xs leading-4 tracking-[-0.2px]">
                {t('employees')}
              </p>
            </div>

            {/* Active Projects */}
            <div className="h-auto min-h-[166px] rounded-lg border border-[#F3F4F6] bg-white p-6 dark:bg-[#28272A]">
              <div className="w-12 h-12 bg-[#FFEDD5] rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#EA580C]" />
              </div>
              <p className="font-inter font-semibold text-gray-600 dark:text-[#FFFFFF] text-2xl leading-8 tracking-[-0.5px] mb-1">
                {stats.totalProjects}
              </p>
              <p className="text-[#6B7280] font-inter font-normal text-xs leading-4 tracking-[-0.2px]">
                {t('activeProjects')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
