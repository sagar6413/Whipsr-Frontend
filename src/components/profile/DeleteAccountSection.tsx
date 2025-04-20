"use client";

import React, { useState } from "react";
import { deleteAccount } from "../../services/userService"; // Adjust path
import { useAuth } from "../../hooks/useAuth"; // Adjust path
import { AxiosApiError } from "../../types/api"; // Adjust path

// Simple Modal Component (replace with your actual modal implementation if you have one)
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Heroicon name: exclamation */}
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteAccountSection: React.FC = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAccount();
      // If deletion is successful, log the user out
      // No need to close modal here, as logout will unmount the component or redirect
      await logout();
      // User will be redirected by AuthProvider's logic or app routing
    } catch (err) {
      const axiosError = err as AxiosApiError;
      setError(
        axiosError.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
      setIsLoading(false);
      setIsModalOpen(false); // Close modal on error
    }
    // Don't set isLoading to false here if logout is successful, as the component might unmount
  };

  const openModal = () => {
    setError(null); // Clear previous errors when opening modal
    setIsModalOpen(true);
  };

  // Style for the delete button (use Tailwind's destructive action colors)
  const deleteButtonStyle =
    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50";
  const generalErrorStyle = "mt-2 text-sm text-red-600";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Delete Account
      </h3>
      <p className="text-sm text-gray-600">
        Permanently delete your account and all associated data. This action
        cannot be undone.
      </p>
      {error && <p className={generalErrorStyle}>{error}</p>}
      <div className="text-right">
        <button
          type="button"
          className={deleteButtonStyle}
          onClick={openModal}
          disabled={isLoading}
        >
          Delete Account
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account Confirmation"
        message="Are you sure you want to permanently delete your account? All your data will be lost. This action cannot be undone."
        confirmText="Yes, Delete My Account"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DeleteAccountSection;
