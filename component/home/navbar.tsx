'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import LanguageSwitcher from '@/component/i18n/LanguageSwitcher';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const FALLBACK_PROFILE_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIzMiIgZmlsbD0iI2UyZThmMCIvPjxjaXJjbGUgY3g9IjMyIiBjeT0iMjYiIHI9IjEyIiBmaWxsPSIjOTRhM2I4Ii8+PHBhdGggZD0iTTE2IDUyYzAtOC44NCA3LjE2LTE2IDE2LTE2czE2IDcuMTYgMTYgMTYiIGZpbGw9IiM5NGEzYjgiLz48L3N2Zz4=';

function resolveProfileImageSrc(profileImage?: string | null) {
  if (!profileImage) return FALLBACK_PROFILE_IMAGE;
  const value = profileImage.trim();
  if (!value) return FALLBACK_PROFILE_IMAGE;
  if (value.startsWith('data:') || value.startsWith('blob:')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;

  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
  return `${apiBaseUrl}/${value.replace(/^\/+/, '')}`;
}

export default function Navbar() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(FALLBACK_PROFILE_IMAGE);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setAvatarSrc(resolveProfileImageSrc(user?.profileImage));
  }, [user?.profileImage]);

  useEffect(() => {
    (async () => {
      try {
        const users = await api.post('/auth/refresh');
        if (!users?.data?.user) {
          router.push('/auth/signin');
          return;
        }

        login(users.data.user, users.data.accessToken);
      } catch {
        router.push('/auth/signin');
      }
    })();
  }, [login, router]);

  const handleAvatarError = () => {
    setAvatarSrc(FALLBACK_PROFILE_IMAGE);
  };

  const avatarAlt = t('profileAlt', { name: user?.name ?? t('userFallback') });

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue to clear client state and redirect even if the API fails.
    } finally {
      logout();
      router.push('/auth/signin');
      setIsMenuOpen(false);
      setIsLoggingOut(false);
    }
  };

  const desktopNavGapSide = isRtl ? 'md:ml-2' : 'md:mr-2';
  const desktopNavLinkClass = (path: string) =>
    [
      'relative inline-flex h-10 items-center px-2 text-[15px] font-[family-name:var(--font-poppins)]',
      'tracking-tight transition-colors duration-200',
      "after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:content-['']",
      'after:origin-center after:transition-transform after:duration-300',
      isActive(path)
        ? 'font-semibold text-blue-600 after:scale-x-100 after:bg-blue-600'
        : 'font-medium text-gray-600 after:scale-x-0 after:bg-blue-500 hover:text-gray-900 hover:after:scale-x-100 dark:text-gray-300 dark:hover:text-white',
    ].join(' ');
  const mobileNavLinkClass = (path: string) =>
    [
      'block rounded-xl px-3 py-2.5 text-sm font-[family-name:var(--font-poppins)] font-medium tracking-tight transition-colors duration-200',
      isActive(path)
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white',
    ].join(' ');


 



  return (
    <nav className="relative z-40 overflow-visible border-b border-gray-200/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#1e1f24]/95">
      <div className="overflow-visible px-4 sm:px-6 lg:px-10 xl:px-20">
        <div
          className={`flex h-[74px] items-center justify-between overflow-visible ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center rounded-xl p-1 transition-colors hover:bg-gray-100/70 dark:hover:bg-white/5"
            >
              <Image
                src="/logo.svg"
                alt={t('logoAlt')}
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                priority
              />
            </Link>
          </div>

         
         

          {/* Desktop nav + controls */}
          <div
            className={`hidden md:flex md:items-center md:gap-3 lg:gap-4 ${isRtl ? 'md:flex-row-reverse' : ''}`}
          >
             <div
              className={`hidden md:flex md:items-center md:gap-1 rounded-2xl bg-gray-50/80 px-2 py-1 dark:bg-white/5 ${desktopNavGapSide}`}
            >
            <Link
              href="/"
              className={desktopNavLinkClass('/')}
            >
              {t('home')}
            </Link>
            <Link
              href="/dashboards"
              className={desktopNavLinkClass('/dashboard')}
            >
              {t('dashboard')}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="relative inline-flex h-10 items-center px-2 text-[15px] font-[family-name:var(--font-poppins)] font-medium tracking-tight text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-300 dark:hover:text-white"
            >
              {t('logout')}
            </button>
          </div>
          <div
            dir="ltr"
            className={`relative flex shrink-0 items-center gap-2 rounded-2xl bg-gray-50/90 p-1.5 ring-1 ring-gray-200/80 dark:bg-white/5 dark:ring-white/10 ${
              isRtl ? 'md:flex-row-reverse' : ''
            }`}
          >
            <LanguageSwitcher floating={false} />
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          <Link
            className="shrink-0 rounded-2xl p-0.5 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:focus-visible:outline-emerald-400"
            href="/company-profile"
          >
          <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-gray-200/90 dark:ring-gray-600">
            <img
              src={avatarSrc}
              alt={avatarAlt}
              width={40}
              height={40}
              onError={handleAvatarError}
              className="h-full w-full object-cover rounded-full"
            />
            </div>
          </Link>
          </div>
            
          </div>

          {/* Mobile menu button */}
          <div className={`flex md:hidden items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {/* Mobile Profile Picture */}
            <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
              <img
                src={avatarSrc}
                alt={avatarAlt}
                width={32}
                height={32}
                onError={handleAvatarError}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">{t('openMainMenu')}</span>
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
        <div className="md:hidden border-t border-gray-200/80 dark:border-white/10">
          <div className="px-3 py-3">
            <div className="mb-3 flex flex-col gap-3 rounded-2xl bg-gray-50/80 p-3 dark:bg-white/5">
              <LanguageSwitcher floating={false} />
              <div className="w-fit">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200/80 px-2 pt-2 pb-3 space-y-1 sm:px-3 dark:border-white/10">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass('/')}
            >
              {t('home')}
            </Link>
            <Link
              href="/dashboards"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass('/dashboards')}
            >
              {t('dashboards')}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-[family-name:var(--font-poppins)] font-medium tracking-tight text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
