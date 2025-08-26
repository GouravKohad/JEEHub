import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleItem {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  startTime: string;
  endTime: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  description?: string;
  type: 'study' | 'revision' | 'practice' | 'break';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;
const TYPES = [
  { value: 'study', label: 'Study Session', color: 'bg-blue-500' },
  { value: 'revision', label: 'Revision', color: 'bg-green-500' },
  { value: 'practice', label: 'Practice', color: 'bg-orange-500' },
  { value: 'break', label: 'Break', color: 'bg-gray-500' }
] as const;

const STORAGE_KEY = 'jee-schedule-items';

export default function Schedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Physics' as ScheduleItem['subject'],
    startTime: '',
    endTime: '',
    day: 'Monday' as ScheduleItem['day'],
    description: '',
    type: 'study' as ScheduleItem['type']
  });
  const { toast } = useToast();

  // Load schedule items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setScheduleItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    }
  }, []);

  // Save schedule items to localStorage
  const saveSchedule = (items: ScheduleItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setScheduleItems(items);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: 'Physics',
      startTime: '',
      endTime: '',
      day: selectedDay as ScheduleItem['day'],
      description: '',
      type: 'study'
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      console.log('Validation failed - missing fields');
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Invalid Time",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    const newItem: ScheduleItem = {
      id: editingItem?.id || Date.now().toString(),
      ...formData
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = scheduleItems.map(item => 
        item.id === editingItem.id ? newItem : item
      );
      toast({
        title: "Schedule Updated",
        description: "Your schedule item has been updated successfully.",
      });
    } else {
      updatedItems = [...scheduleItems, newItem];
      toast({
        title: "Schedule Added",
        description: "New schedule item has been added successfully.",
      });
    }

    saveSchedule(updatedItems);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      description: item.description || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedItems = scheduleItems.filter(item => item.id !== id);
    saveSchedule(updatedItems);
    toast({
      title: "Schedule Deleted",
      description: "Schedule item has been removed.",
    });
  };

  const getDaySchedule = (day: string) => {
    return scheduleItems
      .filter(item => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Chemistry': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Mathematics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeInfo = (type: string) => {
    return TYPES.find(t => t.value === type) || TYPES[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Study Schedule</h1>
          <p className="text-muted-foreground">Plan and organize your JEE preparation schedule</p>
        </div>
        
        <Button 
          onClick={() => {
            console.log('Add Schedule button clicked');
            resetForm();
            setIsAddModalOpen(true);
            console.log('Modal should open, isAddModalOpen:', true);
          }}
          className="flex items-center gap-2"
          data-testid="button-add-schedule"
        >
          <Plus size={16} />
          Add Schedule
        </Button>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Modify your existing schedule item.' : 'Create a new schedule item for your study plan.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Mechanics Chapter"
                  required
                  data-testid="input-schedule-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value as ScheduleItem['subject']})}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as ScheduleItem['type']})}>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="day">Day</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData({...formData, day: value as ScheduleItem['day']})}>
                  <SelectTrigger data-testid="select-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                    data-testid="input-start-time"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                    data-testid="input-end-time"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional notes or topics to cover..."
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" data-testid="button-save-schedule">
                  {editingItem ? 'Update' : 'Add'} Schedule
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  data-testid="button-cancel-schedule"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2">
        {DAYS.map(day => {
          const dayItems = getDaySchedule(day);
          return (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              onClick={() => setSelectedDay(day)}
              className="flex items-center gap-2"
              data-testid={`tab-${day.toLowerCase()}`}
            >
              <CalendarIcon size={16} />
              {day}
              {dayItems.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {dayItems.length}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Schedule for Selected Day */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon size={20} />
            {selectedDay} Schedule
          </CardTitle>
          <CardDescription>
            {getDaySchedule(selectedDay).length} scheduled items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getDaySchedule(selectedDay).length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">No schedule items for {selectedDay}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setFormData({...formData, day: selectedDay as ScheduleItem['day']});
                  setIsAddModalOpen(true);
                }}
                data-testid="button-add-first-schedule"
              >
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {getDaySchedule(selectedDay).map(item => {
                const typeInfo = getTypeInfo(item.type);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-1 h-16 rounded-full ${typeInfo.color}`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <Badge className={getSubjectColor(item.subject)} variant="secondary">
                            {item.subject}
                          </Badge>
                          <Badge variant="outline">
                            {typeInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {item.startTime} - {item.endTime}
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Weekly Overview
          </CardTitle>
          <CardDescription>
            Your complete week schedule at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.map(day => {
              const dayItems = getDaySchedule(day);
              return (
                <div key={day} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center justify-between">
                    {day}
                    <Badge variant="outline">{dayItems.length} items</Badge>
                  </h4>
                  
                  {dayItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No schedule</p>
                  ) : (
                    <div className="space-y-2">
                      {dayItems.slice(0, 3).map(item => (
                        <div key={item.id} className="text-sm">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-muted-foreground">
                            {item.startTime} - {item.endTime}
                          </div>
                        </div>
                      ))}
                      {dayItems.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{dayItems.length - 3} more items
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}