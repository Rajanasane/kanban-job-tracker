// src/components/JobCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobData } from '@/app/page';

interface JobCardProps {
  job: JobData;
  onEdit: (job: JobData) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    // Optional: add a shadow when dragging for better visual feedback
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white p-4 mb-4 rounded-lg shadow-md border-l-4 border-indigo-500 cursor-grab"
    >
      {/* The drag handle area - listeners need to be attached for dragging */}
      <div {...listeners} className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800">{job.role}</h3>
        <p className="text-sm text-gray-600 font-medium">{job.company}</p>
        <p className="text-xs text-gray-500">
          Applied: {new Date(job.dateApplied).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => onEdit(job)}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;