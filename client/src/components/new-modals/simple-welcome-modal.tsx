import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, User } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

interface SimpleWelcomeModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export function SimpleWelcomeModal({ open, onComplete }: SimpleWelcomeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('SimpleWelcomeModal render, open:', open);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    console.log('Welcome modal form submitted with:', data);
    setIsSubmitting(true);
    try {
      console.log('Calling onComplete with name:', data.name);
      onComplete(data.name);
      console.log('onComplete called successfully');
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Error in welcome modal submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!open) {
    console.log('SimpleWelcomeModal not rendering - open is false');
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999 
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8"
        style={{ zIndex: 10000 }}
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to JEE Study Manager!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Let's personalize your study experience. What should we call you?
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="name"
                placeholder="Enter your name..."
                className="pl-10 py-3"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 font-semibold"
          >
            {isSubmitting ? 'Getting Started...' : 'Get Started'}
          </Button>
        </form>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          Your information is stored locally and never shared.
        </p>
      </div>
    </div>
  );
}