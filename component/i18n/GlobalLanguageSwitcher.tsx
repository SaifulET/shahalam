'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const NAVBAR_ROUTES = new Set([
  '/',
  '/dashboard',
  '/dashboards',
  '/addunit',
  '/addmodel',
  '/create-folder',
  '/company-profile',
]);

export default function GlobalLanguageSwitcher() {
  const pathname = usePathname();

  if (pathname && (NAVBAR_ROUTES.has(pathname) || pathname.startsWith('/dashboards/'))) {
    return null;
  }

  return <LanguageSwitcher />;
}
