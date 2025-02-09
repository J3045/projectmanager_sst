import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Force session update when navbar loads
  useEffect(() => {
    update();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Page titles mapping
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/profile": "Profile",
  };

  const isProjectPage = router.pathname.startsWith("/projects/");
  const currentPage = isProjectPage ? "Project Details" : pageTitles[router.pathname] ?? "Your App";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center bg-indigo-700 text-white border-b-2 border-indigo-600 p-4 shadow-lg relative"
    >
      <h1 className="text-2xl font-semibold text-white drop-shadow-lg">{currentPage}</h1>

      <div className="flex items-center gap-4">
        {status === "authenticated" && session?.user && (
          <div className="relative flex items-center gap-4">
            <span className="text-gray-200 font-medium">{session.user.name}</span>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition"
                onClick={toggleDropdown}
              />
            ) : (
              <div
                className="w-10 h-10 bg-indigo-500 text-white font-bold rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
                onClick={toggleDropdown}
              >
                {session.user.name?.[0] || "U"}
              </div>
            )}
          </div>
        )}
      </div>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-14 right-4 bg-white text-gray-800 shadow-lg rounded-lg w-48 border border-gray-200 z-50"
        >
          <ul className="text-gray-800">
            <li
              className="px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              onClick={() => router.push("/profile")}
            >
              Profile
            </li>
            <li
              className="px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition border-t border-gray-300"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;