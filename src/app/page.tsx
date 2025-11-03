import { STATUSES, JobDocument } from '@/lib/Job';
import KanbanBoard from '@/components/KanbanBoard';

// Define the Job Data Structure for the frontend
export type JobData = Omit<JobDocument, '_id' | 'dateApplied'> & {
  _id: string;
  dateApplied: string; // String in YYYY-MM-DD format
};

// SSR Data Fetching (runs on the server before the page loads)
async function getInitialJobs(): Promise<JobData[]> {
  // Determine the correct host URL for the fetch call
  const host = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://<YOUR-DOMAIN>';
  
  try {
    const res = await fetch(`${host}/api/jobs`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.status}`);
    }

    const rawJobs: any[] = await res.json();

    // Map the raw data to the expected JobData structure, ensuring correct types
    return rawJobs.map((job) => {
      // 1. Attempt to create a Date object from the database value
      const jobDate = new Date(job.dateApplied);
      
      // 2. Validate the date using isNaN(date.getTime())
      // If the date is invalid, use the current date as a fallback.
      const safeDate = isNaN(jobDate.getTime()) 
          ? new Date() 
          : jobDate;

      return ({
        // Explicitly convert the ID to a string
        _id: job._id.toString(), 
        company: job.company,
        role: job.role,
        status: job.status,
        // Now safely convert the guaranteed valid date to the 'YYYY-MM-DD' string format
        dateApplied: safeDate.toISOString().split('T')[0],
      }) as JobData;
    });

  } catch (error) {
    console.error('SSR Fetch Error:', error);
    // If you see the RangeError now, it means it's logging the error, 
    // but the fallback should prevent the crash.
    return []; // Return an empty array on failure
  }
}

// The Main Page Component
export default async function Home() {
  const initialJobs = await getInitialJobs();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        💼 Job Application Tracker
      </h1>
      {/* Pass the server-fetched data to the client component */}
      <KanbanBoard initialJobs={initialJobs} statuses={STATUSES} />
    </main>
  );
}
