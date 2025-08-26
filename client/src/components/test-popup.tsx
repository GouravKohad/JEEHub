import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TestPopupProps {
  open: boolean;
  onClose: () => void;
}

export function TestPopup({ open, onClose }: TestPopupProps) {
  console.log('TestPopup render, open:', open);
  
  if (!open) return null;

  const handleClose = () => {
    console.log('TestPopup close button clicked');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999 
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('TestPopup backdrop clicked');
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Test Popup
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This is a test popup to verify that popups are working correctly.
        </p>
        <div className="flex justify-end space-x-3">
          <Button 
            onClick={handleClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TestPopupTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log('Test popup button clicked');
    setIsOpen(true);
  };

  const handleClose = () => {
    console.log('Test popup closed');
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={handleClick}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded fixed top-4 right-4 z-50"
      >
        Test Popup
      </Button>
      <TestPopup open={isOpen} onClose={handleClose} />
    </>
  );
}