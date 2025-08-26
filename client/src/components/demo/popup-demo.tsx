import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SimpleModal } from '@/components/simple-modal';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PopupDemo() {
  const [simpleModalOpen, setSimpleModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrollableModalOpen, setScrollableModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);

  // Generate long content for scrolling demonstration
  const longContent = Array.from({ length: 50 }, (_, i) => (
    <Card key={i} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Item {i + 1}
          <Badge variant="secondary">Demo</Badge>
        </CardTitle>
        <CardDescription>
          This is a demo card item to showcase the scrollable popup functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
          nostrud exercitation ullamco laboris.
        </p>
      </CardContent>
    </Card>
  ));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Enhanced Popup Demo
          </h1>
          <p className="text-muted-foreground">
            Responsive popups with beautiful scrollbars and adaptive height
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Simple Modal Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Modal</CardTitle>
              <CardDescription>Basic modal with enhanced scrollbar</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setSimpleModalOpen(true)}
                className="w-full"
                data-testid="button-open-simple-modal"
              >
                Open Simple Modal
              </Button>
            </CardContent>
          </Card>

          {/* Dialog Component Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Dialog Component</CardTitle>
              <CardDescription>Radix UI dialog with responsive sizing</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" data-testid="button-open-dialog">
                    Open Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogHeader>
                    <DialogTitle>Enhanced Dialog</DialogTitle>
                    <DialogDescription>
                      This dialog demonstrates the enhanced responsive design.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>This is a standard dialog with responsive height and width.</p>
                    <p>The dialog automatically adapts to different screen sizes:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Mobile: 95vh max height</li>
                      <li>Tablet: 85vh max height</li>
                      <li>Desktop: 80vh max height</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Scrollable Modal Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Scrollable Content</CardTitle>
              <CardDescription>Modal with lots of content to demonstrate scrolling</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setScrollableModalOpen(true)}
                className="w-full"
                data-testid="button-open-scrollable-modal"
              >
                Open Scrollable Modal
              </Button>
            </CardContent>
          </Card>

          {/* Large Modal Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Large Modal</CardTitle>
              <CardDescription>Extra large modal with enhanced scrollbar</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setLargeModalOpen(true)}
                className="w-full"
                data-testid="button-open-large-modal"
              >
                Open Large Modal
              </Button>
            </CardContent>
          </Card>

          {/* Alert Dialog Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
              <CardDescription>Confirmation dialog with responsive design</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" data-testid="button-open-alert">
                    Open Alert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Responsive Info */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Features</CardTitle>
              <CardDescription>What's included in the enhanced popups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">Custom Scrollbars</Badge>
                <Badge variant="outline">Responsive Height</Badge>
                <Badge variant="outline">Adaptive Sizing</Badge>
                <Badge variant="outline">Dark Mode Support</Badge>
                <Badge variant="outline">Mobile Optimized</Badge>
                <Badge variant="outline">Smooth Animations</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Modal */}
        <SimpleModal
          open={simpleModalOpen}
          onClose={() => setSimpleModalOpen(false)}
          title="Enhanced Simple Modal"
          size="md"
          scrollable={true}
        >
          <div className="space-y-4">
            <p>This is a simple modal with enhanced features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Beautiful custom scrollbar with gradients</li>
              <li>Responsive height that adapts to screen size</li>
              <li>Smooth hover effects on scrollbar</li>
              <li>Dark mode support</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm">Try scrolling to see the enhanced scrollbar in action!</p>
            </div>
            {/* Add some content to make it scrollable */}
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <h4 className="font-medium">Feature {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  This demonstrates the scrollable content with our enhanced scrollbar design.
                </p>
              </div>
            ))}
          </div>
        </SimpleModal>

        {/* Scrollable Modal with lots of content */}
        <SimpleModal
          open={scrollableModalOpen}
          onClose={() => setScrollableModalOpen(false)}
          title="Scrollable Content Demo"
          size="lg"
          scrollable={true}
        >
          <div className="space-y-4">
            <p className="text-center text-muted-foreground mb-6">
              This modal contains a lot of content to demonstrate the scrolling functionality.
              Notice the beautiful gradient scrollbar on the right side.
            </p>
            {longContent}
          </div>
        </SimpleModal>

        {/* Large Modal */}
        <SimpleModal
          open={largeModalOpen}
          onClose={() => setLargeModalOpen(false)}
          title="Large Modal with Enhanced Features"
          size="xl"
          scrollable={true}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Extra Large Modal</h3>
              <p className="text-muted-foreground">
                This modal demonstrates the XL size with all responsive features enabled.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Scrollbar Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Gradient background</li>
                  <li>• Hover effects with scaling</li>
                  <li>• Smooth transitions</li>
                  <li>• Dark mode compatibility</li>
                  <li>• Responsive width</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Responsive Height:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Mobile: 95vh maximum</li>
                  <li>• Tablet: 85vh maximum</li>
                  <li>• Desktop: 80vh maximum</li>
                  <li>• Minimum height constraints</li>
                  <li>• Adaptive padding</li>
                </ul>
              </div>
            </div>

            {/* Add scrollable content */}
            {Array.from({ length: 20 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Content Block {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is additional content to demonstrate the scrolling behavior. 
                    The scrollbar should appear automatically when content exceeds the 
                    modal height.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SimpleModal>
      </div>
    </div>
  );
}