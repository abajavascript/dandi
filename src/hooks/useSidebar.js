import { useState, useEffect } from "react";

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle responsive behavior - sidebar starts expanded on desktop, collapsed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Desktop: expanded by default
      } else {
        setSidebarOpen(false); // Mobile: collapsed by default
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    sidebarOpen,
    toggleSidebar,
  };
}
