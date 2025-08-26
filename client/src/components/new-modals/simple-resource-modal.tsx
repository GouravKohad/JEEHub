import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertResourceSchema } from '@shared/schema';
import { resourceStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import type { InsertResource } from '@shared/schema';

interface SimpleResourceModalProps {
  open: boolean;
  onClose: () => void;
  onResourceCreated?: () => void;
}

export function SimpleResourceModal({ open, onClose, onResourceCreated }: SimpleResourceModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<InsertResource>({
    resolver: zodResolver(insertResourceSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      subject: 'Physics',
      category: 'website',
    },
  });

  const onSubmit = async (data: InsertResource) => {
    setIsSubmitting(true);
    try {
      const resource = resourceStorage.create(data);
      
      toast({
        title: 'Resource Added',
        description: `Resource "${resource.title}" has been added successfully.`,
      });
      
      reset();
      onClose();
      onResourceCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add resource. Please try again.',
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
      title="Add New Resource"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Resource Title</Label>
          <Input
            id="title"
            placeholder="Enter resource title..."
            {...register('title')}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            {...register('url')}
            className="mt-1"
          />
          {errors.url && (
            <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
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
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValue('category', value as any)} defaultValue="website">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add resource description..."
            rows={3}
            {...register('description')}
            className="mt-1 resize-none"
          />
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
            {isSubmitting ? 'Adding...' : 'Add Resource'}
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
}