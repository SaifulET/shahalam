'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const NAVBAR_ROUTES = new Set([
  '/',
  '/dashboard',
  '/addunit',
  '/addmodel',
  '/create-folder',
  '/company-profile',
]);

export default function GlobalLanguageSwitcher() {
  const pathname = usePathname();

  if (pathname && NAVBAR_ROUTES.has(pathname)) {
    return null;
  }

  return <LanguageSwitcher />;
}
