// src/app/api/jobs/route.ts

import dbConnect from '@/lib/mongodb';
import { getJobModel } from '@/lib/Job'; // Import the function
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Handler for GET /api/jobs (READ)
export async function GET() {
  await dbConnect(); // <-- CONNECT FIRST
  const Job = getJobModel(); // <-- THEN GET THE MODEL
  try {
    const jobs = await Job.find({}).sort({ dateApplied: -1 }).lean(); 
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}

// Handler for POST /api/jobs (Create a new job card)
export async function POST(req: Request) {
  await dbConnect(); // <-- CONNECT FIRST
  const Job = getJobModel(); // <-- THEN GET THE MODEL
  try {
    const body = await req.json();
    const newJob = await Job.create(body); // Create a new job based on the request body
    
    const jobObject = newJob.toJSON();
    jobObject._id = jobObject._id.toString(); 

    return NextResponse.json(jobObject, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);

    // --- Mongoose Validation Error Handling ---
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: error.errors 
      }, { status: 400 });
    }
    // ------------------------------------------
    
    return NextResponse.json({ message: 'Error creating job' }, { status: 500 });
  }
}