# 💼 Job Application Tracker - A Kanban Board

## 🚀 Project Overview

The **Job Application Tracker** is a full-stack **Kanban-style web application** built with **Next.js** and **MongoDB**, designed to help users efficiently manage their job application pipeline.  
It offers a clean, interactive interface where users can move job cards through various stages — from applying to receiving offers.

This project meets the standards for a **modern, production-ready web app** with robust data persistence and a strong developer experience through **TypeScript**.

---

## ✨ Features Implemented

| Feature | Status | Description |
|----------|:------:|-------------|
| **Full CRUD** | ✅ Complete | Users can Create, Read, Update (Edit/Drag), and Delete job entries. |
| **Persistence** | ✅ Complete | All job card data and status changes are saved to a MongoDB database. |
| **Drag & Drop** | 🚧 Placeholder | Currently uses column buttons for status updates; implementation ready for a DND library like `dnd-kit`. |
| **Status Columns** | ✅ Implemented | Default statuses: Applied, Interviewing, Offer Received, and Rejected. |
| **TypeScript** | ⭐️ Bonus | Full TypeScript support for type safety and scalability. |
| **Next.js API Routes** | ✅ Required | Backend logic implemented entirely with Next.js API routes (`/api/jobs`). |

---

## 💻 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **ORM:** Mongoose
- **Frontend:** React Hooks

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally:

### 🧩 Prerequisites
- Node.js (v18+)
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/kanban-job-tracker.git
cd kanban-job-tracker

---

### 2️⃣ Install Dependencies

npm install
# or
yarn install

---

### 3️⃣ Configure Environment Variables

Create a .env.local file in the project root and add your MongoDB connection string:

# .env
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

---

### 4️⃣ Run the Application

Start the development server:

npm run dev
# or
yarn dev

The app will be available at 👉 http://localhost:3000

---

## 🗺️ Project Structure

src/
 ├─ app/
 │   ├─ page.tsx             # Main application file (SSR + renders KanbanBoard)
 │   └─ api/
 │       └─ jobs/
 │           ├─ route.ts     # Handles GET (fetch all) & POST (create)
 │           └─ [id]/route.ts # Handles PUT (update) & DELETE
 ├─ components/
 │   ├─ JobCard.tsx          # Job card component
 │   ├─ JobFormModal.tsx     # Modal for creating/editing jobs
 │   └─ KanbanBoard.tsx      # Main board layout
 └─ lib/
     ├─ Job.ts               # Mongoose schema, model, and interfaces
     └─ mongodb.ts           # MongoDB connection utility

---

## 🔗 Deployment

| Deployment    |                Status               |
| ------------- | :---------------------------------: |
| **Platform**  |        Vercel / Render / etc.       |
| **Live Demo** | [INSERT_YOUR_LIVE_DEMO_URL_HERE](#) |

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🧠 Future Enhancements

✅ Integrate dnd-kit for real drag-and-drop interactivity.

📊 Add analytics for application tracking.

🔔 Implement notification system for upcoming interviews.

👥 Support for multiple users (authentication via NextAuth.js).


