"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../hooks/useSidebar";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Store the API key in sessionStorage to pass it to the protected page
    sessionStorage.setItem("apiKeyToValidate", apiKey.trim());

    // Navigate to protected page for validation
    router.push("/protected");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        <div className="max-w-6xl mx-auto p-6">
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  API Playground
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your API key to access the protected area
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="api-key"
                    className="block text-sm font-medium text-gray-700"
                  >
                    API Key
                  </label>
                  <div className="mt-1">
                    <input
                      id="api-key"
                      name="api-key"
                      type="password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !apiKey.trim()}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Validating...
                      </>
                    ) : (
                      "Submit API Key"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
