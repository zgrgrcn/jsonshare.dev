"use client"
import { ThemeSwitcher } from './ThemeSwitcher'
import NextLink from 'next/link'


export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-white/95 sticky top-0 z-40 overflow-x-hidden bg-white/75 py-3 backdrop-blur dark:bg-dark/75">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-3 xl:max-w-5xl xl:px-0">
        <div>
          <NextLink href="/" aria-label="jsonshare.dev">
              <span className="text-gray-900 dark:text-gray-100">JSON</span>
              <span className="text-gray-500 dark:text-gray-400">Share</span>
          </NextLink>
        </div>
        <div className="flex items-center text-base leading-5">
          {/* <div className="hidden space-x-2 sm:block">
            {headerNavLinks.map((link) => {
              return (
                <Link key={link.title} href={link.href}>
                  <span
                    className={clsx(
                      'inline-block rounded px-2 py-1 font-medium text-gray-900 dark:text-gray-100 sm:px-3 sm:py-2',
                      router.pathname.startsWith(link.href)
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                    data-umami-event={`nav-${link.href.replace('/', '')}`}
                  >
                    {link.title}
                  </span>
                </Link>
              )
            })}
          </div> */}
          {/* <AnalyticsLink /> */}
          {/* <ThemeSwitcher /> */}
          {/* <button
            className="ml-2 mr-1 h-8 w-8 rounded sm:hidden"
            type="button"
            aria-label="Toggle Menu"
            onClick={onToggleNav}
            data-umami-event="mobile-nav-toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
        </div>
      </div>
    </header>
  )
}
