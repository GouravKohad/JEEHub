import { useState, useEffect } from 'react';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { userProfileStorage } from '@/lib/storage';
import { Palette, User, Brush, Save } from 'lucide-react';
import type { UserProfile } from '@/lib/storage';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const colorThemes = [
  { name: 'Blue', value: 'blue', colors: 'from-blue-500 to-blue-600' },
  { name: 'Green', value: 'green', colors: 'from-green-500 to-green-600' },
  { name: 'Purple', value: 'purple', colors: 'from-purple-500 to-purple-600' },
  { name: 'Orange', value: 'orange', colors: 'from-orange-500 to-orange-600' },
  { name: 'Pink', value: 'pink', colors: 'from-pink-500 to-pink-600' },
  { name: 'Indigo', value: 'indigo', colors: 'from-indigo-500 to-indigo-600' },
];

const fontSizes = [
  { name: 'Small', value: 'sm' },
  { name: 'Medium', value: 'md' },
  { name: 'Large', value: 'lg' },
];

const animationLevels = [
  { name: 'Minimal', value: 'minimal' },
  { name: 'Normal', value: 'normal' },
  { name: 'Enhanced', value: 'enhanced' },
];

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    colorTheme: 'blue',
    fontSize: 'md',
    animationLevel: 'normal',
  });

  useEffect(() => {
    if (open) {
      const profile = userProfileStorage.get();
      if (profile) {
        setUserProfile(profile);
        setFormData({
          name: profile.name || '',
          colorTheme: 'blue',
          fontSize: 'md',
          animationLevel: 'normal',
        });
      }
    }
  }, [open]);

  const handleSaveSettings = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your name.',
        variant: 'destructive',
      });
      return;
    }

    const updatedProfile = userProfileStorage.update({
      name: formData.name.trim(),
      preferences: {
        defaultSubject: userProfile?.preferences?.defaultSubject || 'Physics',
        defaultTimerDuration: userProfile?.preferences?.defaultTimerDuration || 25,
        theme: theme === 'system' ? 'light' : theme,
      },
    });

    if (updatedProfile) {
      // Apply color theme immediately
      applyColorTheme(formData.colorTheme);

      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const applyColorTheme = (colorTheme: string) => {
    const root = document.documentElement;
    
    // Define color schemes for each theme
    const colorSchemes: { [key: string]: { [key: string]: string } } = {
      blue: {
        '--primary': '217 91% 60%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(217, 91%, 60%)',
        '--jee-accent': 'hsl(224, 76%, 48%)',
        '--jee-secondary': 'hsl(213, 82%, 73%)',
      },
      green: {
        '--primary': '142 76% 36%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(142, 76%, 36%)',
        '--jee-accent': 'hsl(134, 61%, 41%)',
        '--jee-secondary': 'hsl(142, 70%, 58%)',
      },
      purple: {
        '--primary': '262 83% 58%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(262, 83%, 58%)',
        '--jee-accent': 'hsl(271, 91%, 65%)',
        '--jee-secondary': 'hsl(262, 70%, 78%)',
      },
      orange: {
        '--primary': '25 95% 53%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(25, 95%, 53%)',
        '--jee-accent': 'hsl(31, 100%, 58%)',
        '--jee-secondary': 'hsl(25, 85%, 73%)',
      },
      pink: {
        '--primary': '330 81% 60%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(330, 81%, 60%)',
        '--jee-accent': 'hsl(336, 84%, 57%)',
        '--jee-secondary': 'hsl(330, 70%, 78%)',
      },
      indigo: {
        '--primary': '239 84% 67%',
        '--primary-foreground': '0 0% 98%',
        '--jee-primary': 'hsl(239, 84%, 67%)',
        '--jee-accent': 'hsl(243, 75%, 59%)',
        '--jee-secondary': 'hsl(239, 70%, 85%)',
      },
    };

    const scheme = colorSchemes[colorTheme];
    if (scheme) {
      Object.entries(scheme).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="App Settings"
      size="md"
    >
      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Profile</h3>
          </div>
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="mt-1"
              data-testid="input-settings-name"
            />
          </div>
        </div>

        <Separator />

        {/* Appearance Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>
          
          {/* Theme Toggle */}
          <div>
            <Label>Theme</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                data-testid="button-theme-light"
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                data-testid="button-theme-dark"
              >
                Dark
              </Button>
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <Label>Color Theme</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {colorThemes.map((colorTheme) => (
                <button
                  key={colorTheme.value}
                  onClick={() => {
                    setFormData({ ...formData, colorTheme: colorTheme.value });
                    // Apply theme immediately for preview
                    applyColorTheme(colorTheme.value);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.colorTheme === colorTheme.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  data-testid={`button-color-theme-${colorTheme.value}`}
                >
                  <div className={`w-full h-6 rounded bg-gradient-to-r ${colorTheme.colors} mb-2`} />
                  <span className="text-xs font-medium">{colorTheme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <Label>Font Size</Label>
            <Select value={formData.fontSize} onValueChange={(value) => setFormData({ ...formData, fontSize: value })}>
              <SelectTrigger className="mt-1" data-testid="select-font-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Animation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brush size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Animations</h3>
          </div>
          
          <div>
            <Label>Animation Level</Label>
            <Select value={formData.animationLevel} onValueChange={(value) => setFormData({ ...formData, animationLevel: value })}>
              <SelectTrigger className="mt-1" data-testid="select-animation-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.animationLevel === 'minimal' && 'Reduces motion for better performance'}
              {formData.animationLevel === 'normal' && 'Standard animations and transitions'}
              {formData.animationLevel === 'enhanced' && 'Rich animations and visual effects'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            data-testid="button-settings-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto bg-primary text-primary-foreground"
            data-testid="button-settings-save"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}