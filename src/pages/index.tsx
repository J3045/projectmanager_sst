import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Head>
        <title>ManagePro - Streamline Your Workflow</title>
        <meta name="description" content="The ultimate project management tool for teams." />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white">
        <div className="container flex flex-col items-center text-center px-6 py-20">
          <motion.h1 
            className="text-6xl font-extrabold leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Supercharge Your <span className="text-yellow-300">Projects</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg max-w-2xl opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Organize, collaborate, and track progress effortlessly with our cutting-edge project management tool.
          </motion.p>

          <motion.div 
            className="mt-10 flex gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <AuthShowcase />
          </motion.div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData ? (
        <Link href="/dashboard">
          <motion.button
            className="rounded-full px-8 py-4 text-lg font-semibold bg-white text-[#6a11cb] shadow-lg transition-all hover:bg-yellow-300 hover:scale-105"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </Link>
      ) : (
        <motion.button
          className="rounded-full px-8 py-4 text-lg font-semibold bg-yellow-400 text-gray-900 shadow-lg transition-all hover:bg-yellow-500 hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signIn()}
        >
          Get Started
        </motion.button>
      )}
    </>
  );
}
