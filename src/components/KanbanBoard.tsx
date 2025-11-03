'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { JobData } from '@/app/page';
import { Status } from '@/lib/Job';
import KanbanColumn from './KanbanColumn'; // <--- Must be a DEFAULT import
import JobCard from './JobCard'; // <--- Must be a DEFAULT import
import JobFormModal from './JobFormModal'; // <--- CORRECTED: Path must match file name

interface KanbanBoardProps {
  initialJobs: JobData[];
  statuses: readonly Status[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialJobs, statuses }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);

  // Group jobs by status for easy column rendering
  const jobsByStatus = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc[job.status] = acc[job.status] || [];
        acc[job.status].push(job);
        return acc;
      },
      {} as Record<Status, JobData[]>,
    );
  }, [jobs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const findJob = (id: string) => jobs.find((job) => job._id === id);
  
  // --- Modal / CRUD Handlers ---

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null); // Clear the job being edited
  };

  const handleAdd = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job: JobData) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // NOTE: For better UX, consider replacing window.confirm with a custom modal.
    // window.confirm is used here for simplicity in debugging.
    if (!window.confirm("Are you sure you want to delete this job application?")) return;

    // 1. Optimistic UI update
    setJobs(prev => prev.filter(job => job._id !== id));

    // 2. Server request
    try {
        const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            // In a real app, you'd handle re-fetching if the delete fails
            throw new Error('Server delete failed');
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Refresh the page to restore state.');
    }
  };

  const handleSave = async (jobData: Partial<JobData>) => {
    const isUpdate = !!jobData._id;
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate ? `/api/jobs/${jobData._id}` : '/api/jobs';
    
    // Safety check and logging
    console.log('Sending Request:', method, url, JSON.stringify(jobData)); 

    if (isUpdate && !jobData._id) {
        console.error("Attempted update with missing ID!");
        alert("Cannot update job: ID is missing.");
        return;
    }
    
   try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData),
        });
        
        // --- CRITICAL DEBUGGING LOGIC: READ THE SERVER ERROR RESPONSE ---
        if (!res.ok) {
            let errorMessage = 'Failed to save job (Unknown Error)';
            try {
                const errorBody = await res.json();
                // Check if the server returned our structured validation error (status 400)
                if (errorBody.message === 'Validation failed' && errorBody.errors) {
                    const errorDetails = Object.keys(errorBody.errors).map(key => 
                        `\n\t- ${key}: ${errorBody.errors[key].message}`
                    ).join('');
                    errorMessage = `Validation Failed: Check the following fields: ${errorDetails}`;
                } else {
                    // This captures the "Job not found" (404) or general server errors (500)
                    errorMessage = errorBody.message || `Server responded with status ${res.status}`;
                }
            } catch (e) {
                // Fallback for non-JSON errors
                errorMessage = `Server responded with status ${res.status} but no details.`;
            }
            
            // Log the full error details to the browser console
            console.error("API Error Details:", errorMessage); 
            alert("Failed to save job. See console for validation details.");
            throw new Error(errorMessage);
        }
        // --- END CRITICAL DEBUGGING LOGIC ---

        // The API returns the job object, which includes the new or existing _id
        const savedJob: JobData = await res.json(); 
        
        // Update local state
        setJobs(prevJobs => {
            if (isUpdate) {
                // Find and replace the updated job
                return prevJobs.map(job => 
                    job._id === savedJob._id ? { ...savedJob, dateApplied: new Date(savedJob.dateApplied).toISOString().split('T')[0] } : job
                );
            } else {
                // Add the new job to the top of the list
                return [{ ...savedJob, dateApplied: new Date(savedJob.dateApplied).toISOString().split('T')[0] }, ...prevJobs];
            }
        });

    } catch (error) {
        console.error('Save Job Handler Error:', error);
        // Alert is already handled inside the if (!res.ok) block
    } finally {
        handleCloseModal();
    }
  };
  
  // --- DND Handlers ---

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    const draggedJob = findJob(activeId);
    if (!draggedJob) return;

    let newStatus: Status | null = null;
    
    // 1. Determine the NEW status (the column it was dropped on)
    if (statuses.includes(overId as Status)) {
        // Dropped directly on a column
        newStatus = overId as Status;
    } else {
        // Dropped on another card, find that card's column
        const overJob = findJob(overId);
        if(overJob) newStatus = overJob.status;
    }
    
    if (!newStatus || newStatus === draggedJob.status) {
        return;
    }

    // 2. Update the local state (Optimistic UI)
    const updatedJob: JobData = { ...draggedJob, status: newStatus };
    setJobs((prevJobs) => prevJobs.map((job) =>
        job._id === activeId ? updatedJob : job
    ));

    // 3. Update the database (PERSISTENCE)
    try {
        await fetch(`/api/jobs/${activeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
    } catch (error) {
        console.error('Failed to update job status on server', error);
        alert('Failed to update status on server. Please check your connection.');
        // OPTIONAL: setJobs back to prevJobs if the server update fails
    }
  }, [jobs, statuses, findJob]); 

  const activeJob = activeId ? findJob(activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          + Add New Job
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobsByStatus[status] || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* DragOverlay shows a clone of the item being dragged */}
      <DragOverlay>
        {activeJob ? (
          <div className="shadow-2xl opacity-90">
            {/* The job prop here is for display only, not interaction */}
            <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} /> 
          </div>
        ) : null}
      </DragOverlay>

      {/* Render the Modal component */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobToEdit={editingJob}
        onSave={handleSave}
      />
    </DndContext>
  );
};

export default KanbanBoard;
