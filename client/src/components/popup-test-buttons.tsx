import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SimpleTaskModal } from '@/components/new-modals/simple-task-modal';
import { SimpleResourceModal } from '@/components/new-modals/simple-resource-modal';
import { SimpleConfirmationDialog } from '@/components/new-modals/simple-confirmation-dialog';

export function PopupTestButtons() {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleTaskCreated = () => {
    console.log('Task created callback triggered');
  };

  const handleResourceCreated = () => {
    console.log('Resource created callback triggered');
  };

  const handleConfirm = () => {
    console.log('Confirmation dialog confirmed');
  };

  return (
    <div className="fixed bottom-4 left-4 space-y-2 z-50">
      <div className="space-x-2">
        <Button
          onClick={() => {
            console.log('Opening task modal');
            setTaskModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Test Task Modal
        </Button>
        <Button
          onClick={() => {
            console.log('Opening resource modal');
            setResourceModalOpen(true);
          }}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Test Resource Modal
        </Button>
        <Button
          onClick={() => {
            console.log('Opening confirmation dialog');
            setConfirmDialogOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Test Confirm Dialog
        </Button>
      </div>

      <SimpleTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <SimpleResourceModal
        open={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        onResourceCreated={handleResourceCreated}
      />

      <SimpleConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirm}
        title="Test Confirmation"
        description="This is a test confirmation dialog. Are you sure you want to proceed?"
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        variant="destructive"
        icon="warning"
      />
    </div>
  );
}