"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import AddProjectForm from "~/components/AddProjectForm";
import AddTaskModal from "~/components/AddTaskModal";
import { api } from "~/utils/api";
import { type Task, TaskStatus } from "@prisma/client";



const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    projectId: number;
    projectName: string;
  } | null>(null);
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch projects using tRPC
  const { data: projects, isError, refetch, isLoading } = api.project.getAllProjects.useQuery();

  // Delete project mutation
  const deleteProject = api.project.deleteProject.useMutation({
    onMutate: ({ id }) => setLoadingProjectId(id),
    onSuccess: () => {
      setDeleteConfirmation(null);
      refetch();
    },
    onSettled: () => setLoadingProjectId(null),
  });

  // Determine project status based on tasks
  const getProjectStatus = (tasks: Task[]) => {
    if (tasks.length === 0) return "No Tasks";
    return tasks.every((task) => task.status === TaskStatus.COMPLETED) ? "Completed" : "In Progress";
  };

  // Handle project deletion confirmation
  const handleDeleteConfirmation = (projectId: number, projectName: string) => {
    setDeleteConfirmation({ projectId, projectName });
  };

  // Handle actual project deletion
  const handleDeleteProject = () => {
    if (deleteConfirmation) {
      deleteProject.mutate({ id: deleteConfirmation.projectId });
    }
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Error fetching projects. Please try again later.
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Dashboard Header */}
        <motion.div
          className="flex justify-between items-center mb-12 p-8 rounded-xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, <span className="text-indigo-400">{session?.user?.name || "User"}</span>!
            </h1>
            <p className="mt-2 text-lg text-gray-300">Track your projects and tasks effortlessly</p>
          </div>
        </motion.div>

        {/* Create Project Button */}
        <motion.div
          className="mb-8 flex justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-500 transition transform hover:scale-105 focus:ring-4 focus:ring-indigo-300"
          >
            {isAddingProject ? "Adding..." : "+ Create New Project"}
          </button>
        </motion.div>

        {/* Add Project Modal */}
        {showModal && (
          <AddProjectForm
            onClose={() => setShowModal(false)}
            refetch={refetch}
            setIsAddingProject={setIsAddingProject}
          />
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-gray-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 border-l-4 border-indigo-500 flex flex-col justify-between h-[250px] cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              {/* Project Title */}
              <h3 className="text-2xl font-semibold text-gray-800">{project.name}</h3>

              {/* Project Description */}
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                {project.description && project.description.length > 100
                  ? `${project.description.substring(0, 100)}...`
                  : project.description ?? "No description available"}
              </p>

              {/* Task & Status */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-700">
                  <span className="font-bold">Tasks:</span> {project.tasks.length}
                </div>
                <p
                  className={`text-sm font-semibold ${
                    getProjectStatus(project.tasks) === "Completed"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {getProjectStatus(project.tasks)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {/* Add Task Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project.id);
                    setShowTaskModal(true);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-500 transition"
                >
                  {isAddingTask && selectedProject === project.id ? "Adding..." : "Add Task"}
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfirmation(project.id, project.name);
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-md shadow-md hover:bg-red-500 transition"
                >
                  {loadingProjectId === project.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && selectedProject && (
        <AddTaskModal
          projectId={selectedProject}
          onClose={() => setShowTaskModal(false)}
          refetchTasks={refetch}
       
        />
      )}

      {/* Deletion Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete "{deleteConfirmation.projectName}"?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleDeleteProject}
              >
                {loadingProjectId === deleteConfirmation.projectId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
