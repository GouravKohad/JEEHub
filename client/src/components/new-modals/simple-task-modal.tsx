import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertTaskSchema } from '@shared/schema';
import { taskStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import type { InsertTask } from '@shared/schema';

interface SimpleTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export function SimpleTaskModal({ open, onClose, onTaskCreated }: SimpleTaskModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: '',
      subject: 'Physics',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const priority = watch('priority');
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: InsertTask) => {
    setIsSubmitting(true);
    try {
      const task = taskStorage.create(data);
      
      toast({
        title: 'Task Created',
        description: `Task "${task.title}" has been created successfully.`,
      });
      
      reset();
      onClose();
      onTaskCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Create New Task"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            placeholder="Enter task title..."
            {...register('title')}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select onValueChange={(value) => setValue('subject', value as any)} defaultValue="Physics">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add task description..."
            rows={3}
            {...register('description')}
            className="mt-1 resize-none"
          />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            min={today}
            {...register('dueDate')}
            className="mt-1"
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <Label>Priority</Label>
          <div className="flex space-x-2 mt-1">
            {[
              { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
              { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
              { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('priority', option.value as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  priority === option.value 
                    ? option.color 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
}