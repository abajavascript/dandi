"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Notification from "../../components/Notification";

export default function ProtectedPage() {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isValidating, setIsValidating] = useState(true);
  const [isValidKey, setIsValidKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateKey = async () => {
      // Get the API key from sessionStorage
      const apiKey = sessionStorage.getItem("apiKeyToValidate");

      if (!apiKey) {
        // If no API key is found, redirect back to playground
        router.push("/playground");
        return;
      }

      // Remove the API key from sessionStorage for security
      // sessionStorage.removeItem("apiKeyToValidate");

      try {
        // Validate API key using internal API endpoint
        const response = await fetch("/api/validate-api-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiKey }),
        });

        const result = await response.json();

        setIsValidKey(result.isValid);
        setIsValidating(false);

        if (result.isValid) {
          setNotification({
            show: true,
            message: `Valid API key "${
              result.keyData?.name || "Unknown"
            }" - /protected can be accessed`,
            type: "success",
          });
        } else {
          setNotification({
            show: true,
            message:
              result.error ||
              "Invalid API Key - not found in database or inactive",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsValidKey(false);
        setIsValidating(false);
        setNotification({
          show: true,
          message: "Error validating API key. Please try again.",
          type: "error",
        });
      }
    };

    validateKey();
  }, [router]);

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, show: false }));

    // If invalid key, redirect back to playground after notification closes
    if (!isValidKey) {
      setTimeout(() => {
        router.push("/playground");
      }, 500);
    }
  };

  const handleTryAgain = () => {
    router.push("/playground");
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
          <h2 className="text-xl font-semibold text-gray-900">
            Validating API Key...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Protected Area
          </h1>
          <p className="text-lg text-gray-600">
            {isValidKey
              ? "🎉 Welcome! Your API key has been validated successfully."
              : "❌ Access denied. Invalid API key provided."}
          </p>
        </div>

        {isValidKey ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              API Playground
            </h2>
            <p className="text-gray-600 mb-6">
              Congratulations! You now have access to the protected area. Here
              you can:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Test API endpoints
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Access advanced features
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View detailed documentation
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleTryAgain}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Another Key
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                The API key you provided is not valid. Please make sure
                you&apos;re using a valid API key that exists in the database
                and is active.
              </p>
              <button
                onClick={handleTryAgain}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={handleNotificationClose}
        duration={4000}
      />
    </div>
  );
}
