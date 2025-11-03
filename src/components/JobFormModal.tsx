// src/components/JobFormModal.tsx
import React, { useState, useEffect } from 'react';
import { JobData } from '@/app/page';
import { STATUSES, Status } from '@/lib/Job';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit: JobData | null;
  onSave: (job: Partial<JobData>) => void; // Handles both Add (no _id) and Edit (with _id)
}

// Define initial state for the form
const initialFormState = {
  company: '',
  role: '',
  dateApplied: new Date().toISOString().split('T')[0],
  status: 'Applied' as Status,
};

const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, jobToEdit, onSave }) => {
  const [formData, setFormData] = useState<typeof initialFormState>({ ...initialFormState });
  const isEditing = !!jobToEdit;

  // Effect to populate form data when editing an existing job
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        company: jobToEdit.company,
        role: jobToEdit.role,
        // Ensure dateApplied is in the YYYY-MM-DD format for the input field
        dateApplied: new Date(jobToEdit.dateApplied).toISOString().split('T')[0],
        status: jobToEdit.status,
      });
    } else {
      setFormData({ ...initialFormState }); // Reset for new job
    }
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null; // Don't render if not open

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave: Partial<JobData> = {
      ...formData,
      dateApplied: new Date(formData.dateApplied).toISOString(), // Convert back to ISO string for MongoDB
    };

    if (isEditing) {
      // Include the ID for the update operation
      dataToSave._id = jobToEdit!._id;
    }

    onSave(dataToSave); // Call the save handler in the parent component
    onClose();
  };

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto transform transition-all">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          {isEditing ? 'Edit Job Application' : 'Add New Application'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>

          <div>
            <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700">Date Applied</label>
            <input
              type="date"
              id="dateApplied"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>

          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              {isEditing ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;