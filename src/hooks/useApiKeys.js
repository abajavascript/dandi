import { useState, useEffect } from "react";
import {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  toggleApiKeyStatus,
} from "../../lib/api-keys";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load API keys from Supabase on hook mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await getApiKeys();

      if (error) {
        throw new Error(error);
      }

      setApiKeys(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const handleCreate = async (formData, onSuccess) => {
    try {
      setError(null);
      const { data, error } = await createApiKey(formData);

      if (error) {
        throw new Error(error);
      }

      setApiKeys([data, ...apiKeys]);

      if (onSuccess) {
        onSuccess(`API key "${data.name}" created successfully`);
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      console.error("Failed to create API key:", err);
      return { success: false, error: err.message };
    }
  };

  // Update existing API key
  const handleUpdate = async (keyId, formData, onSuccess) => {
    try {
      setError(null);
      const { data, error } = await updateApiKey(keyId, formData);

      if (error) {
        throw new Error(error);
      }

      setApiKeys(apiKeys.map((key) => (key.id === keyId ? data : key)));

      if (onSuccess) {
        onSuccess(`API key "${data.name}" updated successfully`);
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      console.error("Failed to update API key:", err);
      return { success: false, error: err.message };
    }
  };

  // Delete API key
  const handleDelete = async (id, onSuccess) => {
    if (
      confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    ) {
      try {
        setError(null);
        const { error } = await deleteApiKey(id);

        if (error) {
          throw new Error(error);
        }

        // Get the key name before filtering for the notification
        const deletedKey = apiKeys.find((key) => key.id === id);
        setApiKeys(apiKeys.filter((key) => key.id !== id));

        if (onSuccess) {
          onSuccess(
            `API key "${deletedKey?.name}" deleted successfully`,
            "error"
          );
        }

        return { success: true };
      } catch (err) {
        setError(err.message);
        console.error("Failed to delete API key:", err);
        return { success: false, error: err.message };
      }
    }
    return { success: false, cancelled: true };
  };

  // Toggle API key active status
  const handleToggleStatus = async (id, onSuccess) => {
    try {
      setError(null);
      const currentKey = apiKeys.find((key) => key.id === id);
      const newStatus = !currentKey.is_active;

      const { data, error } = await toggleApiKeyStatus(id, newStatus);

      if (error) {
        throw new Error(error);
      }

      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, is_active: newStatus } : key
        )
      );

      const keyName = currentKey.name;
      const statusText = newStatus ? "activated" : "deactivated";

      if (onSuccess) {
        onSuccess(`API key "${keyName}" ${statusText} successfully`);
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error("Failed to toggle API key status:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    apiKeys,
    loading,
    error,
    setError,
    loadApiKeys,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  };
}
