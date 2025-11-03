import mongoose, { Model, Document } from 'mongoose';

// Define the possible statuses (columns)
export const STATUSES = [
  'Applied',
  'Interviewing',
  'Offer Received',
  'Rejected',
] as const;
export type Status = typeof STATUSES[number];

// 1. Interface for Job Data (Used by the frontend and API responses)
export interface JobData {
  _id: string; // CRITICAL: Must be a string for frontend components to form the URL
  company: string;
  role: string;
  dateApplied: Date | string; 
  status: Status;
}

// 2. Interface for the Mongoose Document (Used by the backend model)
export interface JobDocument extends Omit<JobData, '_id' | 'dateApplied'>, Document {
    dateApplied: Date; // The schema handles this as a Date object
}

// Define the Mongoose Schema
const JobSchema = new mongoose.Schema<JobDocument>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  dateApplied: { type: Date, default: Date.now, required: true },
  status: {
    type: String,
    required: true,
    enum: STATUSES,
    default: 'Applied',
  },
}, { 
    timestamps: true 
});

// Function to get the Mongoose Model, checking if it already exists
export function getJobModel(): Model<JobDocument> {
  const Job = (mongoose.models.Job || mongoose.model<JobDocument>('Job', JobSchema)) as Model<JobDocument>;
  return Job;
}

// Export the necessary types.
// NOTE: Your frontend components must import JobData for job objects.
// If your components are currently importing JobData from @/app/page, ensure that file 
// re-exports this JobData type.