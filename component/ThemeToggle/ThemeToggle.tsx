'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations('themeToggle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'
  const nextThemeLabel = isDark ? t('light') : t('dark')

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={nextThemeLabel}
      aria-pressed={isDark}
      title={nextThemeLabel}
      className="relative inline-flex h-10 w-16 items-center rounded-2xl bg-gray-100/90 p-1 backdrop-blur transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-gray-800/85 dark:focus-visible:outline-emerald-400"
    >
      <span className="sr-only">{nextThemeLabel}</span>

      <span
        aria-hidden="true"
        className={`absolute left-2.5 transition-opacity ${
          isDark ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <SunIcon className="h-4 w-4 text-amber-500" />
      </span>

      <span
        aria-hidden="true"
        className={`absolute right-2.5 transition-opacity ${
          isDark ? 'opacity-100' : 'opacity-45'
        }`}
      >
        <MoonIcon className="h-4 w-4 text-slate-500 dark:text-slate-200" />
      </span>

      <span
        aria-hidden="true"
        className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
          isDark
            ? 'translate-x-6 bg-slate-700 text-slate-100'
            : 'translate-x-0 bg-white/95 text-amber-500'
        }`}
      >
        {isDark ? (
          <MoonIcon className="h-4 w-4" />
        ) : (
          <SunIcon className="h-4 w-4" />
        )}
      </span>
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
