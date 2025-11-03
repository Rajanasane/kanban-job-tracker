import { NextRequest, NextResponse } from 'next/server';
import { getJobModel } from '@/lib/Job'; 
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Handler for PUT /api/jobs/[id] (UPDATE a job card)
// This signature ensures Next.js correctly provides the 'id' parameter.
export async function PUT(req: NextRequest, context: any) {
    // CRITICAL FIX: We extract the ID from context.params using a type assertion.
    const { id } = context.params as { id: string }; 

    console.log(`Attempting to update job with ID: ${id}`); 

    await dbConnect(); 
    const Job = getJobModel(); 
  
    try {
      const body = await req.json();
      
      // Use the extracted ID
      const job = await Job.findByIdAndUpdate(id, body, { 
        new: true, 
        runValidators: true 
      });
      
      if (!job) {
        return NextResponse.json({ message: 'Job not found' }, { status: 404 });
      }

      // Assert type and ensure _id is stringified for the frontend
      const jobObject = job.toObject() as { _id: any, [key: string]: any };
      jobObject._id = jobObject._id.toString();

      return NextResponse.json(jobObject, { status: 200 });
    } catch (error) {
      console.error('Error updating job:', error);
      
      if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ 
          message: 'Validation failed', 
          errors: error.errors 
        }, { status: 400 });
      }

      return NextResponse.json({ message: 'Error updating job' }, { status: 500 });
    }
}

// Handler for DELETE /api/jobs/[id] (DELETE a job card)
export async function DELETE(req: NextRequest, context: any) {
    // CRITICAL FIX: We extract the ID from context.params using a type assertion.
    const { id } = context.params as { id: string }; 
    
    await dbConnect(); 
    const Job = getJobModel(); 
  
    try {
      // Use the extracted ID
      const deletedJob = await Job.deleteOne({ _id: id });

      if (deletedJob.deletedCount === 0) {
        return NextResponse.json({ message: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Successfully deleted' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting job:', error);
      return NextResponse.json({ message: 'Error deleting job' }, { status: 500 });
    }
}
