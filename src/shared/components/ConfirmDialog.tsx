import React from 'react';
import { Dialog } from './Dialog';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  isLoading = false,
}) => {
  const confirmButtonClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300',
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-red-300',
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      <div className="mb-6">
        {typeof message === 'string' ? (
          <p className="text-gray-600">{message}</p>
        ) : (
          <div className="text-gray-600">{message}</div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-md text-sm font-medium"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-md text-sm font-medium ${confirmButtonClasses[confirmVariant]}`}
        >
          {isLoading ? 'Aguarde...' : confirmText}
        </button>
      </div>
    </Dialog>
  );
};
