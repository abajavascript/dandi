"use client";

import { useEffect, useState, useCallback } from "react";

export default function Notification({
  show,
  message,
  onClose,
  duration = 3000,
  type = "success", // "success" or "error"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    // Slide-out animation
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 400); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (show) {
      // Show the notification with slide-in animation
      setIsVisible(true);
      setIsAnimating(false); // Start with hidden state

      // Trigger animation after DOM update
      const animationTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50); // Longer delay for visible animation

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(hideTimer);
      };
    } else {
      // Reset states when show becomes false
      setIsAnimating(false);
      setIsVisible(false);
    }
  }, [show, duration, handleClose]);

  if (!isVisible) return null;

  // Define styles based on type
  const styles = {
    success: {
      bg: "bg-green-500",
      border: "border-green-400",
      iconBg: "bg-white",
      iconColor: "text-green-500",
      textColor: "text-green-100",
      hoverBg: "hover:bg-green-600",
      icon: "M5 13l4 4L19 7", // checkmark
    },
    error: {
      bg: "bg-red-500",
      border: "border-red-400",
      iconBg: "bg-white",
      iconColor: "text-red-500",
      textColor: "text-red-100",
      hoverBg: "hover:bg-red-600",
      icon: "M6 18L18 6M6 6l12 12", // X mark
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`transform transition-all duration-400 ease-out ${
          isAnimating
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-90"
        }`}
      >
        <div
          className={`${currentStyle.bg} text-white px-6 py-4 rounded-lg shadow-xl border ${currentStyle.border} flex items-center space-x-3 min-w-[320px] max-w-md`}
        >
          <div className="flex-shrink-0">
            <div
              className={`w-6 h-6 ${currentStyle.iconBg} rounded-full flex items-center justify-center`}
            >
              <svg
                className={`w-4 h-4 ${currentStyle.iconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d={currentStyle.icon}
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${currentStyle.textColor} hover:text-white transition-colors p-1 ${currentStyle.hoverBg} rounded-full`}
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
