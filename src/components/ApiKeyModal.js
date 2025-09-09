import { useState, useEffect, useRef } from "react";

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  editingKey = null,
  initialFormData = {
    name: "",
    description: "",
    permissions: "read",
    usageLimit: "1000",
  },
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isMouseDownOnBackdrop, setIsMouseDownOnBackdrop] = useState(false);
  const modalRef = useRef(null);

  // Sync form data with prop changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleBackdropMouseDown = (e) => {
    // Only set flag if the mousedown is directly on the backdrop, not on modal content
    if (e.target === e.currentTarget) {
      setIsMouseDownOnBackdrop(true);
    }
  };

  const handleBackdropMouseUp = (e) => {
    // Only close if mousedown started on backdrop and mouseup is also on backdrop
    if (isMouseDownOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
    setIsMouseDownOnBackdrop(false);
  };

  // Reset the flag when mouse leaves the backdrop area
  const handleBackdropMouseLeave = () => {
    setIsMouseDownOnBackdrop(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
      onMouseLeave={handleBackdropMouseLeave}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingKey ? "Edit API Key" : "Create a new API key"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter a name and limit for the new API key.
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="keyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Key Name —{" "}
                <span className="text-gray-500 font-normal">
                  A unique name to identify this key
                </span>
              </label>
              <input
                type="text"
                id="keyName"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Key Name"
              />
            </div>

            <div>
              <label
                htmlFor="usageLimit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Limit monthly usage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="usageLimit"
                required
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                * If the combined usage of all your keys exceeds your
                plan&apos;s limit, all requests will be rejected.
              </p>
            </div>

            {editingKey && (
              <>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div>
                  <label
                    htmlFor="permissions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Permissions
                  </label>
                  <select
                    id="permissions"
                    value={formData.permissions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        permissions: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                    <option value="admin">Full Access</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              {editingKey ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
