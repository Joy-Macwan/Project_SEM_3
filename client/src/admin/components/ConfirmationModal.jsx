import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  type = 'danger', // 'danger', 'warning', 'info'
  confirmationText = '',
  confirmationRequired = false,
  confirmationPlaceholder = 'Type to confirm',
  confirmationValue = '',
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [canConfirm, setCanConfirm] = React.useState(!confirmationRequired);
  
  // Update confirmation state when input changes
  React.useEffect(() => {
    if (confirmationRequired) {
      setCanConfirm(inputValue === confirmationValue);
    }
  }, [inputValue, confirmationValue, confirmationRequired]);
  
  // Reset input value when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setCanConfirm(!confirmationRequired);
    }
  }, [isOpen, confirmationRequired]);
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Get modal styling based on type
  const getModalStyling = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          ),
          confirmButtonClass: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: (
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          ),
          confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
      default:
        return {
          icon: (
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
          ),
          confirmButtonClass: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };
  
  const modalStyles = getModalStyling();
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div className="mt-2">
                  {modalStyles.icon}
                  <h3 className="text-base font-semibold leading-6 text-gray-900 mt-4 text-center">{title}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">{message}</p>
                  </div>
                  
                  {confirmationRequired && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">{confirmationText}</p>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={confirmationPlaceholder}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                canConfirm
                  ? confirmButtonClass || modalStyles.confirmButtonClass
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={onConfirm}
              disabled={!canConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;