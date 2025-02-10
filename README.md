# 📌 Project Management App

## 🔍 Overview

This project is a **📝 Task Management & 🤝 Collaboration Tool** built using the **T3 Stack**. It provides an intuitive interface for 📌 project creation, ✅ task assignment, and 📊 tracking, alongside user 👤 profile management.

## 🛠️ Tech Stack

- **💻 Frontend:** Next.js (T3 Stack), TypeScript, 🎨 Tailwind CSS
- **🖥️ Backend:** Serverless API using **SST (Serverless Stack)**, tRPC
- **🗄️ Database:** Supabase (PostgreSQL)
- **🔐 Authentication:** 🌀 Discord OAuth via NextAuth.js
- **📦 ORM:** Prisma
- **📌 State Management:** React Hooks & tRPC
- **🚀 Deployment:** AWS using SST & Vercel (Temporary Deployment)

## 🎯 Features

### 1️⃣ 📝 Task Management

- 📌 Create, 🎯 assign, and 📊 track tasks
- ⏳ Set deadlines, 🔝 priorities, and 🏷️ tags
- 🗒️ Add detailed task descriptions
- 👥 Assign tasks to users
- 🔄 Track task status and updates

### 2️⃣ 👤 User Profiles

- Users can manage personal 🆔 profiles

### 3️⃣ 🔄 Dynamic Project Management

- 📁 Projects are created dynamically and appear in the 📜 sidebar automatically
- 📜 Sidebar updates dynamically to reflect newly added projects
- 🔍 Users can open individual 📁 projects from the sidebar and 📊 dashboard
- 📝 Within each project page:
  - ➕ Users can add, 🛠️ update, and 🔄 change task statuses
  - 📌 Users can track the status of tasks efficiently

### 4️⃣ 📊 Dashboard

- 🏗️ Overview of Projects, ⏳ deadlines, and 📌 Status
- 📈 Project timelines and 📉 analytics
- 🔍 Filter
- ➕ Can directly add projects and tasks from here and also 🛠️ update and ❌ delete them

### 5️⃣ 🔐 Authentication

- OAuth with 🌀 Discord via NextAuth.js

## ⚙️ Installation

### 📌 Prerequisites

Ensure you have the following installed:

- 🟢 Node.js (>= 18.x)
- 🗄️ PostgreSQL (via Supabase)
- ☁️ AWS CLI (for SST deployment)

### 🛠️ Clone the repository

```bash
git clone -b master https://github.com/J3045/projectmanagementapp2.0.git
cd ProjectManagementApp
```

### 📦 Install Dependencies

```bash
npm install -f
```

### 🗄️ Set Up Environment Variables

Create a `.env` file and add the necessary 🔑 credentials.

```env
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_url"
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET="your_auth_secret"
AUTH_DISCORD_ID="your_discord_id"
AUTH_DISCORD_SECRET="your_discord_secret"
```

### 🚀 Run the Application

```bash
npm run dev
```

## 🌍 Deployment

### ☁️ Deploying with SST (Future Implementation)

```bash
npx sst deploy
```

### 🔄 Temporary Deployment (Vercel)

Due to ongoing work on SST integration, the project is currently deployed on ☁️ Vercel.

## 🛠️ Testing

Unit tests are included for key functionalities using **🧪 Vitest**.
Run tests using:

```bash
npm run test
```

## 🔗 API Endpoints (tRPC)

### 📁 Project Endpoints

- `project.getAllProjects` - 📥 Fetch all projects
- `project.createProject` - ➕ Create a new project
- `project.updateProject` - 🛠️ Update an existing project
- `project.deleteProject` - ❌ Delete a project

### 📝 Task Endpoints

- `task.createTask` - ➕ Create a new task
- `task.getTasksByProject` - 📥 Fetch tasks for a project
- `task.updateTask` - 🛠️ Update a task
- `task.deleteTask` - ❌ Delete a task

## 📁 Folder Structure

```
.
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── auth/[...nextAuth]/route.ts
│   ├── components
│   │   ├── 📌 AddProjectForm.tsx
│   │   ├── 📝 AddTaskModal.tsx
│   │   ├── 🔄 GlobalLoader.tsx
│   │   ├── 🏗️ Layout.tsx
│   │   ├── 📜 Navbar.tsx
│   │   ├── 📂 Sidebar.tsx
│   │   ├── 📤 FileUpload.tsx
│   ├── pages
│   │   ├── api
│   │   │   ├── trpc/[trpc.ts]
│   │   ├── auth
│   │   │   ├── ❌ error.tsx
│   │   │   ├── 🔑 signin.tsx
│   │   │   ├── 🆕 signup.tsx
│   │   ├── projects
│   │   │   ├── [id].tsx
│   │   ├── 🏠 _app.tsx
│   │   ├── 📊 dashboard.tsx
│   │   ├── 🏠 index.tsx
│   │   ├── 👤 profile.tsx
│   ├── server
│   │   ├── auth
│   │   │   ├── 🔑 config.ts
│   │   │   ├── 🔗 index.ts
│   │   ├── api
│   │   │   ├── routers
│   │   │   │   ├── 🔑 auth.ts
│   │   │   │   ├── 📁 project.ts
│   │   │   │   ├── 📝 task.ts
│   │   │   │   ├── 👥 userRouter.ts
│   │   │   │   ├── 📤 fileUpload.ts
│   │   │   ├── 🌐 root.ts
│   │   │   ├── 🔄 trpc.ts
│   │   ├── 🗄️ db.js
│   ├── styles
│   │   ├── 🎨 globals.css
│   ├── utils
│   │   ├── 🔗 api.ts
│   ├── 🔧 env.js
├── __tests__ (🧪 Unit tests)
├── 🔑 .env (🔐 Environment variables)
├── 📦 package.json
├── 📖 README.md
```

## 🚀 Future Improvements

- ☁️ **Full Integration of SST** once development progresses
- 🧪 **More test cases for better coverage**
- 🔐 **Role-Based Access Control (RBAC) for permissions management**
- 📊 Advanced analytics on 🏗️ task completion trends
- 📱 Mobile-friendly UI enhancements
- 📩 Email verification during sign-up using **Supabase Magic Link**
- 🔑 Forgot password functionality
- 🤖 AI-powered task suggestions
- 📅 Calendar view for tasks & deadlines
- 🔔 Customizable notifications


## 🤝 Contributors

- **👨‍💻 JAINIK PATEL** - [🔗 GitHub](https://github.com/J3045)

