"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Overview",
      href: "/dashboards",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
          />
        </svg>
      ),
    },
    {
      name: "Research Assistant",
      href: "/research-assistant",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      name: "Research Reports",
      href: "/research-reports",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "API Playground",
      href: "/playground",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Documentation",
      href: "/documentation",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      external: true,
    },
  ];

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo/Brand */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="flex items-center space-x-3 overflow-hidden w-full">
          {isOpen && (
            <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
              Dandi AI
            </h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 ml-auto"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              // Collapse icon (chevron left)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              // Expand icon (chevron right)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className={isOpen ? "px-3" : "px-2"}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150 ${
                    isOpen ? "px-3" : "px-2 justify-center"
                  }`}
                  title={!isOpen ? item.name : undefined}
                >
                  <span
                    className={`text-gray-400 group-hover:text-gray-500 flex-shrink-0 ${
                      isOpen ? "mr-3" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {isOpen && (
                    <>
                      <span className="truncate">{item.name}</span>
                      <svg
                        className="ml-auto w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </>
                  )}
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isOpen ? "px-3" : "px-2 justify-center"
                } ${
                  isActive
                    ? "bg-blue-50 text-blue-700" +
                      (isOpen ? " border-r-2 border-blue-700" : "")
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <span
                  className={`flex-shrink-0 ${isOpen ? "mr-3" : ""} ${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                {isOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
