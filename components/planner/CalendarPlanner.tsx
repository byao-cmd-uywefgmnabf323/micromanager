"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskModal, Task } from './TaskModal';
import { supabase } from '@/lib/supabaseClient';
import { EventSourceInput } from '@fullcalendar/core';
import { toast } from 'sonner';

export function CalendarPlanner() {
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();
  const [modalState, setModalState] = useState<{ isOpen: boolean; task: Task | null }>({ isOpen: false, task: null });
  const [currentTitle, setCurrentTitle] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  // Auth check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      }
    };
    checkSession();
  }, [router]);

  const fetchTasks = useCallback(async (fetchInfo: any, successCallback: (events: any) => void, failureCallback: (error: any) => void) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return failureCallback('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start', fetchInfo.start.toISOString())
        .lte('start', fetchInfo.end.toISOString());

      if (error) throw error;

      const events = data.map(t => ({
        id: t.id,
        title: t.title,
        start: t.start,
        end: t.end,
        allDay: t.all_day,
        extendedProps: { notes: t.notes, status: t.status },
      }));
      successCallback(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      failureCallback(error);
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
      setModalState({ isOpen: true, task: { ...task, start: task.start, end: task.end, all_day: task.all_day } });
    }
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, task: null });
  };

  const handleModalSave = async (task: Task) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const taskToSave = {
      user_id: session.user.id,
      title: task.title,
      notes: task.notes,
      start: new Date(task.start).toISOString(),
      end: task.end ? new Date(task.end).toISOString() : null,
      all_day: task.all_day,
      status: task.status,
    };

    try {
      let error;
      if (task.id) {
        const { error: updateError } = await supabase.from('tasks').update(taskToSave).eq('id', task.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('tasks').insert(taskToSave);
        error = insertError;
      }

      if (error) throw error;

      toast.success('Task saved successfully.');
      calendarRef.current?.getApi().refetchEvents();
      handleModalClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task.');
    }
  };

  const handleModalDelete = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast.success('Task deleted.');
      calendarRef.current?.getApi().refetchEvents();
      handleModalClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    }
  };

  const handleEventUpdate = async (updateInfo: any) => {
    const { event } = updateInfo;
    const taskToUpdate = {
      start: event.start.toISOString(),
      end: event.end ? event.end.toISOString() : event.start.toISOString(),
      all_day: event.allDay,
    };
    try {
      const { error } = await supabase.from('tasks').update(taskToUpdate).eq('id', event.id);
      if (error) throw error;
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
          events={fetchTasks as EventSourceInput}
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
