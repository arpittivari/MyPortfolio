import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Button from './Button.jsx';
/**
 * A reusable modal component for displaying messages, errors, or confirmations.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {string} props.title - Title of the message.
 * @param {string} props.message - The main content/body of the message.
 * @param {'info' | 'success' | 'warning' | 'error'} props.type - Styling context.
 * @param {string} [props.confirmText] - If present, shows a primary button.
 * @param {function} [props.onConfirm] - Function to call when confirm button is clicked.
 */
const MessageModal = ({ isOpen, onClose, title, message, type = 'info', confirmText, onConfirm }) => {
  if (!isOpen) return null;

  let Icon;
  let iconClasses;
  let headerClasses;

  switch (type) {
    case 'success':
      Icon = CheckCircle;
      iconClasses = 'text-green-500';
      headerClasses = 'text-green-800 dark:text-green-300';
      break;
    case 'warning':
      Icon = AlertTriangle;
      iconClasses = 'text-yellow-500';
      headerClasses = 'text-yellow-800 dark:text-yellow-300';
      break;
    case 'error':
      Icon = AlertTriangle;
      iconClasses = 'text-red-500';
      headerClasses = 'text-red-800 dark:text-red-300';
      break;
    default:
      Icon = Info;
      iconClasses = 'text-blue-500';
      headerClasses = 'text-blue-800 dark:text-blue-300';
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/70 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className={`p-4 border-b dark:border-gray-700 flex items-center justify-between ${headerClasses}`}>
          <h3 className={`text-lg font-semibold flex items-center space-x-2 ${iconClasses}`}>
            <Icon className="w-6 h-6" />
            <span>{title}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-gray-700 dark:text-gray-300">
          <p>{message}</p>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} className="min-w-[100px]">
            {confirmText ? 'Cancel' : 'Close'}
          </Button>

          {confirmText && (
            <Button variant="primary" onClick={handleConfirm} className="min-w-[100px]">
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;