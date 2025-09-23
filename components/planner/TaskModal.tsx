"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Task = {
  id?: string;
  title: string;
  notes?: string;
  start: string;
  end?: string;
  all_day: boolean;
  status: 'todo' | 'done';
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  task: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, onDelete, task: initialTask }: TaskModalProps) {
  const [task, setTask] = useState<Task | null>(initialTask);
  const [error, setError] = useState('');

  useEffect(() => {
    setTask(initialTask);
    setError('');
  }, [initialTask, isOpen]);

  const handleSave = () => {
    if (!task?.title) {
      setError('Title is required.');
      return;
    }
    if (task.end && new Date(task.start) > new Date(task.end)) {
      setError('End date cannot be before start date.');
      return;
    }
    onSave(task);
  };

  const handleDelete = () => {
    if (task?.id && onDelete) {
      onDelete(task.id);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{task.id ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={task.notes || ''}
              onChange={(e) => setTask({ ...task, notes: e.target.value })}
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type={task.all_day ? 'date' : 'datetime-local'}
                value={task.start}
                onChange={(e) => setTask({ ...task, start: e.target.value })}
                className="bg-neutral-800 border-neutral-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type={task.all_day ? 'date' : 'datetime-local'}
                value={task.end || ''}
                onChange={(e) => setTask({ ...task, end: e.target.value })}
                className="bg-neutral-800 border-neutral-700"
                disabled={task.all_day}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="all-day"
              checked={task.all_day}
              onCheckedChange={(checked) => setTask({ ...task, all_day: checked })}
            />
            <Label htmlFor="all-day">All-day</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={task.status}
              onValueChange={(value: 'todo' | 'done') => setTask({ ...task, status: value })}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-between">
          <div>
            {task.id && (
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
