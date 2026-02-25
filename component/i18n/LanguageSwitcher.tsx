'use client';

import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AppLocale, LOCALE_COOKIE_NAME } from '@/lib/i18n';

interface LanguageSwitcherProps {
  floating?: boolean;
  className?: string;
}

const LOCALE_META: Record<AppLocale, { flag: string; labelKey: 'english' | 'arabic' }> = {
  en: { flag: '🇺🇸', labelKey: 'english' },
  ar: { flag: '🇸🇦', labelKey: 'arabic' },
};

export default function LanguageSwitcher({
  floating = true,
  className = '',
}: LanguageSwitcherProps) {
  const t = useTranslations('languageSwitcher');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentLocaleMeta = LOCALE_META[locale] ?? LOCALE_META.en;
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleChange = (nextLocale: AppLocale) => {
    setIsOpen(false);
    if (nextLocale === locale) return;

    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.refresh();
    });
  };

  const control = (
    <div ref={wrapperRef} className={`relative z-50 shrink-0 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => !isPending && setIsOpen((value) => !value)}
        disabled={isPending}
        aria-label={t('label')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="group inline-flex h-10 min-w-[9.75rem] items-center justify-between gap-2 rounded-2xl bg-gray-100/90 px-2 backdrop-blur transition-colors hover:bg-gray-100 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-gray-800/85 dark:hover:bg-gray-800 dark:focus-visible:outline-emerald-400"
      >
        <span
          className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-xl bg-white/85 text-base leading-none dark:bg-gray-700/70"
          >
            {currentLocaleMeta.flag}
          </span>
          <span className="min-w-[4.25rem] text-sm font-medium text-gray-900 dark:text-gray-100">
            {t(currentLocaleMeta.labelKey)}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 dark:text-gray-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        role="menu"
        aria-label={t('label')}
        className={`absolute top-[calc(100%+0.5rem)] z-[70] w-44 rounded-2xl bg-white/95 p-1.5 backdrop-blur-md ring-1 ring-black/5 transition-all duration-200 dark:bg-gray-800/95 dark:ring-white/10 ${
          isRtl ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
        } ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        <div
          className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {t('label')}
        </div>

        {(['en', 'ar'] as AppLocale[]).map((option) => {
          const meta = LOCALE_META[option];
          const active = option === locale;

          return (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => handleChange(option)}
              className={`mt-1 flex w-full items-center justify-between rounded-xl px-2 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-500 dark:focus-visible:outline-emerald-400 ${
                active
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700/70 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100/80 dark:text-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              <span
                className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {meta.flag}
                </span>
                <span className="text-sm font-medium">{t(meta.labelKey)}</span>
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  active ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!floating) return control;

  return <div className="fixed top-3 left-3 z-[100]">{control}</div>;
}
