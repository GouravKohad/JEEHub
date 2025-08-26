import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { scheduleStorage } from '@/lib/storage';
import type { ScheduleItem } from '@shared/schema';

const subjectColors = {
  Physics: 'bg-blue-600',
  Chemistry: 'bg-green-600',
  Mathematics: 'bg-purple-600',
};

export function TodaysSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(scheduleStorage.getTodaysSchedule());

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    const updated = scheduleStorage.update(id, { completed });
    if (updated) {
      setSchedule(scheduleStorage.getTodaysSchedule());
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100 p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={18} />
            Today's Schedule
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-jee-primary hover:text-blue-700 transition-colors"
            data-testid="button-add-schedule"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="space-y-3">
          {schedule.length === 0 ? (
            <div className="text-center py-8 text-jee-muted">
              <Calendar className="mx-auto mb-3 opacity-50" size={24} />
              <p className="text-sm">No schedule for today</p>
              <p className="text-xs">Add your first schedule item!</p>
            </div>
          ) : (
            schedule.map((item) => {
              const colorClass = subjectColors[item.subject];
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    item.completed 
                      ? 'bg-gray-100 opacity-60' 
                      : item.subject === 'Physics' 
                        ? 'bg-blue-50' 
                        : item.subject === 'Chemistry' 
                          ? 'bg-green-50' 
                          : 'bg-purple-50'
                  }`}
                  data-testid={`schedule-item-${item.id}`}
                >
                  <div className={`w-2 h-8 ${colorClass} rounded-full`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-jee-muted">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleComplete(item.id, !item.completed)}
                    className="text-xs"
                    data-testid={`button-toggle-${item.id}`}
                  >
                    {item.completed ? 'Undo' : 'Done'}
                  </Button>
                </div>
              );
            })
          )}
        </div>
        
        {/* Default schedule items if none exist */}
        {schedule.length === 0 && (
          <div className="space-y-3 mt-4 opacity-60">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Physics Mock Test</p>
                <p className="text-xs text-jee-muted">10:00 AM - 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-8 bg-green-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Chemistry Revision</p>
                <p className="text-xs text-jee-muted">2:00 PM - 4:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-8 bg-purple-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Math Practice</p>
                <p className="text-xs text-jee-muted">6:00 PM - 8:00 PM</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
