import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface SimpleConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning';
  icon?: 'delete' | 'warning';
}

export function SimpleConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  icon = 'warning'
}: SimpleConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const IconComponent = icon === 'delete' ? Trash2 : AlertTriangle;
  const iconColor = variant === 'destructive' ? 'text-red-500' : 'text-yellow-500';
  const buttonColor = variant === 'destructive' 
    ? 'bg-red-500 hover:bg-red-600' 
    : 'bg-yellow-500 hover:bg-yellow-600';

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-md"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {description}
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className={`text-white ${buttonColor}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}