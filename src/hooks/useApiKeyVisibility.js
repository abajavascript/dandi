import { useState } from "react";

export function useApiKeyVisibility() {
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  // Toggle API key visibility
  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  return {
    visibleKeys,
    toggleKeyVisibility,
  };
}
