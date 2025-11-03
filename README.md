💼 Job Application Tracker - A Kanban Board

🚀 Project Overview

The Job Application Tracker is a full-stack Kanban-style application built with Next.js and MongoDB, designed to help users efficiently manage their job application pipeline. It provides a clean, interactive interface where users can track progress by moving cards through distinct status columns.

This project meets the requirements for a modern, production-ready web application with robust persistence and a focus on developer experience through TypeScript.

✨ Features Implemented

The application provides a complete solution for managing job applications, including:

Feature

Status

Description

Full CRUD

✅ Complete

Users can Create, Read, Update (Edit/Drag), and Delete job entries.

Persistence

✅ Complete

All job card data and status changes are saved to a MongoDB database.

Drag & Drop

🚧 Placeholder

Currently uses column buttons for status updates; implementation is ready for a DND library like dnd-kit.

Status Columns

✅ Implemented

Default statuses: Applied, Interviewing, Offer Received, and Rejected.

TypeScript

⭐️ Bonus

Entire frontend and backend (API Routes) are written in TypeScript for type safety and scalability.

Next.js API Routes

✅ Required

Backend logic (Node.js/Express substitute) is fully implemented using Next.js API routes (/api/jobs).

💻 Tech Stack

Framework: Next.js 14 (App Router)

Language: TypeScript

Styling: Tailwind CSS

Database: MongoDB

ORM: Mongoose

Client-Side: React Hooks

⚙️ Setup Instructions

Follow these steps to get the project running on your local machine.

Prerequisites

Node.js (v18+)

MongoDB instance (local or remote/Atlas)

1. Clone the Repository

git clone [INSERT_YOUR_PUBLIC_GITHUB_REPO_URL_HERE]
cd kanban-job-tracker



2. Install Dependencies

npm install
# or
yarn install



3. Configure Environment Variables

Create a file named .env.local in the root of the project directory and add your MongoDB connection string:

# .env.local
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"



4. Run the Application

Start the development server:

npm run dev
# or
yarn dev



The application will be accessible at http://localhost:3000.

🗺️ Project Structure

The project follows a modular Next.js structure:

src/app/page.tsx: The main application file, responsible for fetching initial data (SSR) and rendering the <KanbanBoard>.

src/components/: Reusable React components (e.g., JobCard, JobFormModal, KanbanBoard).

src/lib/Job.ts: Defines the Mongoose Schema, Model, and TypeScript interfaces for the job entity.

src/lib/mongodb.ts: The connection utility for MongoDB.

src/app/api/jobs/: Contains all backend logic using Next.js API routes:

route.ts: Handles GET (fetch all) and POST (create new).

[id]/route.ts: Handles dynamic routes for PUT (update) and DELETE operations.

🔗 Live Demo & Deployment

Deployment Status: Running on Vercel/Render/etc.

[INSERT_YOUR_LIVE_DEMO_URL_HERE]
