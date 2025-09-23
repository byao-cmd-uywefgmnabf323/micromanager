"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskModal, Task } from './TaskModal';
import { useHabits } from '@/store/useHabits';
import { toast } from 'sonner';

export function CalendarPlanner() {
  const calendarRef = useRef<FullCalendar>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; task: Task | null }>({ isOpen: false, task: null });
  const [currentTitle, setCurrentTitle] = useState('');

  const tasks = useHabits((s) => s.tasks);
  const addTask = useHabits((s) => s.addTask);
  const updateTask = useHabits((s) => s.updateTask);
  const deleteTask = useHabits((s) => s.deleteTask);

  const events = useMemo(() => tasks.map(t => ({
    id: t.id,
    title: t.title,
    start: t.start,
    end: t.end,
    allDay: t.all_day,
    extendedProps: { notes: t.notes, status: t.status },
  })), [tasks]);

  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCurrentTitle(api.view.title);
    }
  }, []);

  const handleDateClick = (arg: any) => {
    setModalState({ isOpen: true, task: { title: '', start: arg.dateStr, all_day: true, status: 'todo' } });
  };

  const handleSelect = (arg: any) => {
    setModalState({ isOpen: true, task: { title: '', start: arg.startStr, end: arg.endStr, all_day: arg.allDay, status: 'todo' } });
  };

  const handleEventClick = (arg: any) => {
    const task = tasks.find(t => t.id === arg.event.id);
    if (task) {
      setModalState({ isOpen: true, task });
    }
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, task: null });
  };

  const handleModalSave = (task: Task) => {
    try {
      if (task.id) {
        updateTask(task.id, task);
      } else {
        addTask(task);
      }
      toast.success('Task saved successfully.');
      handleModalClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task.');
    }
  };

  const handleModalDelete = (taskId: string) => {
    try {
      deleteTask(taskId);
      toast.success('Task deleted.');
      handleModalClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    }
  };

  const handleEventUpdate = (updateInfo: any) => {
    const { event } = updateInfo;
    try {
      updateTask(event.id, {
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : event.start.toISOString(),
        all_day: event.allDay,
      });
      toast.success('Task updated.');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
      updateInfo.revert();
    }
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.prev();
    setCurrentTitle(api.view.title);
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.next();
    setCurrentTitle(api.view.title);
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.today();
    setCurrentTitle(api.view.title);
  };

  const handleViewChange = (view: string) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(view);
    setCurrentTitle(api.view.title);
  };

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
          <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
          <h2 className="text-xl font-semibold ml-4">{currentTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleViewChange('dayGridMonth')}>Month</Button>
          <Button variant="outline" onClick={() => handleViewChange('timeGridWeek')}>Week</Button>
          <Button variant="outline" onClick={() => handleViewChange('timeGridDay')}>Day</Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="h-[75vh]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          dateClick={handleDateClick}
          select={handleSelect}
          eventClick={handleEventClick}
          events={events}
          eventDrop={handleEventUpdate}
          eventResize={handleEventUpdate}
        />
      </div>

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        task={modalState.task}
      />
    </div>
  );
}
