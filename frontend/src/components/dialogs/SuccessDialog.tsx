import React from 'react';
import { FaCheckCircle, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  isOpen, 
  onClose, 
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500" size={64} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Project Created Successfully!
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          Your crowdfunding campaign has been successfully created and submitted to the blockchain!
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Close & Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;
