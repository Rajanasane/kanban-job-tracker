// src/components/KanbanColumn.tsx
import React from 'react';
import { Status } from '@/lib/Job';
import { JobData } from '@/app/page';
import JobCard from './JobCard';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanColumnProps {
  status: Status;
  jobs: JobData[];
  onEdit: (job: JobData) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, jobs, onEdit, onDelete }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: status, data: { isColumn: true } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Map status to a color for visual appeal
  const colorMap: Record<Status, string> = {
    Applied: 'border-blue-500 bg-blue-50',
    Interviewing: 'border-yellow-500 bg-yellow-50',
    'Offer Received': 'border-green-500 bg-green-50',
    Rejected: 'border-red-500 bg-red-50',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col w-full md:w-1/4 min-h-full rounded-xl p-4 shadow-lg ${colorMap[status]}`}
    >
      <div className="flex justify-between items-center mb-4 cursor-grab" {...attributes} {...listeners}>
        <h2 className="text-xl font-bold text-gray-800">{status}</h2>
        <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full">{jobs.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* SortableContext is where the cards inside the column are handled */}
        <SortableContext
          items={jobs.map(job => job._id)} // List of draggable IDs
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;