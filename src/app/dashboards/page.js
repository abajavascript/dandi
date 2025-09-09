"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Notification from "../../components/Notification";
import DashboardHeader from "../../components/DashboardHeader";
import ErrorMessage from "../../components/ErrorMessage";
import ApiKeysTable from "../../components/ApiKeysTable";
import ApiKeyModal from "../../components/ApiKeyModal";
import { useApiKeys } from "../../hooks/useApiKeys";
import { useSidebar } from "../../hooks/useSidebar";
import { useNotifications } from "../../hooks/useNotifications";
import { useApiKeyVisibility } from "../../hooks/useApiKeyVisibility";

export default function Dashboard() {
  // State for modal and form management
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  // Custom hooks for all major functionality
  const {
    apiKeys,
    loading,
    error,
    setError,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  } = useApiKeys();

  const { sidebarOpen, toggleSidebar } = useSidebar();
  const {
    showToast,
    toastMessage,
    toastType,
    showToastNotification,
    handleNotificationClose,
  } = useNotifications();
  const { visibleKeys, toggleKeyVisibility } = useApiKeyVisibility();

  // Start editing
  const startEdit = (key) => {
    setEditingKey(key);
    setShowCreateForm(false);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingKey(null);
  };

  // Handle form submission for create/update
  const handleFormSubmit = async (formData) => {
    if (editingKey) {
      const result = await handleUpdate(
        editingKey.id,
        formData,
        showToastNotification
      );
      if (result.success) {
        setEditingKey(null);
      }
    } else {
      const result = await handleCreate(formData, showToastNotification);
      if (result.success) {
        setShowCreateForm(false);
      }
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCreateForm(false);
    cancelEdit();
  };

  // Get initial form data based on editing state
  const getInitialFormData = () => {
    if (editingKey) {
      return {
        name: editingKey.name,
        description: editingKey.description || "",
        permissions: editingKey.permissions,
        usageLimit: editingKey.usage_limit?.toString() || "1000",
      };
    }
    return {
      name: "",
      description: "",
      permissions: "read",
      usageLimit: "1000",
    };
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
          {/* Header Component */}
          <DashboardHeader />

          {/* Error Component */}
          <ErrorMessage error={error} onClose={() => setError(null)} />

          {/* API Keys Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    API Keys
                  </h2>
                  <p className="text-sm text-gray-500">
                    The key is used to authenticate your requests to the
                    Research API. To learn more, see the documentation page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingKey(null);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  disabled={loading}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  +
                </button>
              </div>
            </div>

            {/* API Keys Table Component */}
            <ApiKeysTable
              apiKeys={apiKeys}
              loading={loading}
              visibleKeys={visibleKeys}
              onToggleVisibility={toggleKeyVisibility}
              onEdit={startEdit}
              onDelete={(id) => handleDelete(id, showToastNotification)}
              onToggleStatus={(id) =>
                handleToggleStatus(id, showToastNotification)
              }
              onNotification={showToastNotification}
            />
          </div>

          {/* API Key Modal Component */}
          <ApiKeyModal
            isOpen={showCreateForm || editingKey}
            onClose={handleModalClose}
            onSubmit={handleFormSubmit}
            editingKey={editingKey}
            initialFormData={getInitialFormData()}
          />

          {/* Notification Component */}
          <Notification
            show={showToast}
            message={toastMessage}
            type={toastType}
            onClose={handleNotificationClose}
            duration={3000}
          />
        </div>
      </div>
    </div>
  );
}
