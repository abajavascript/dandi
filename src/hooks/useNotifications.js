import { useState } from "react";

export function useNotifications() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Show toast notification
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setShowToast(false);
  };

  return {
    showToast,
    toastMessage,
    toastType,
    showToastNotification,
    handleNotificationClose,
  };
}
