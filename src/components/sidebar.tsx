import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { FaHome, FaTh, FaUsers, FaCog, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

interface Project {
  id: number;
  name: string;
}

const Sidebar = () => {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const router = useRouter();

  // Fetch projects using tRPC
  const { data: projects, error } = api.project.getAllProjects.useQuery();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, href: "/dashboard" },
    { name: "Projects", icon: <FaTh />, href: "/projects" },
    { name: "profile", icon: <FaCog />, href: "/profile" },
  ];

  // Handle errors
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-800 text-white">
        <span>Error loading projects: {error.message}</span>
      </div>
    );
  }

  // Handle project click to toggle dropdown
  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setProjectsOpen(!projectsOpen);
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: expanded ? 250 : 80 }}
      className="h-screen bg-gray-800 text-white p-4 flex flex-col shadow-lg relative transition-all"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-6">
        {/* Display logo from the public folder */}
        <Image
          src="/logo.png" // Logo image from public folder
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full border-2 border-gray-300 shadow-md"
        />
        {expanded && <span className="text-lg font-medium">Project Manager</span>} {/* Display App Name */}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-4">
        {menuItems.map(({ name, icon, href }) => (
          <div key={name}>
            {name === "Projects" ? (
              <button
                onClick={handleProjectClick}
                className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all ${
                  router.pathname === href ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-white"
                }`}
              >
                {icon}
                {expanded && <span>{name}</span>}
              </button>
            ) : (
              <Link
                href={href}
                className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all ${
                  router.pathname === href ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-white"
                }`}
              >
                {icon}
                {expanded && <span>{name}</span>}
              </Link>
            )}
            {name === "Projects" && expanded && projectsOpen && (
              <div className="pl-8 mt-2 space-y-2">
                {projects?.map((project: Project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`block p-2 rounded-lg transition-all ${
                      router.pathname === `/projects/${project.id}` ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-white"
                    }`}
                  >
                    {project.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-1/2 right-[-16px] transform -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-all"
      >
        {expanded ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
