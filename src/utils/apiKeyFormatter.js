// Format API key for display
export const formatApiKey = (key, keyId, visibleKeys) => {
  if (visibleKeys.has(keyId)) {
    return key; // Show full key
  }
  return key.substring(0, 4) + "•".repeat(32) + key.substring(key.length - 4); // Masked version
};
