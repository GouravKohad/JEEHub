import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

interface WelcomeModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    onComplete(data.name);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md animate-scale-in [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-jee-primary to-jee-accent rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to JEE Study Manager!
          </DialogTitle>
          <p className="text-jee-muted">
            Let's personalize your study experience. What should we call you?
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Your Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Enter your name..."
                        className="pl-10 py-3 text-base"
                        {...field}
                        data-testid="input-user-name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-jee-primary text-white py-3 text-base font-medium hover:bg-blue-700 transition-all duration-200"
              data-testid="button-save-name"
            >
              Get Started
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-xs text-jee-muted mt-4">
          Your information is stored locally on your device and never shared.
        </div>
      </DialogContent>
    </Dialog>
  );
}