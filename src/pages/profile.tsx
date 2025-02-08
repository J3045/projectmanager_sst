import { useState } from "react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Profile() {
  const { data: user, isLoading } = api.user.getUserProfile.useQuery();
  const updateProfile = api.user.updateUserProfile.useMutation();
  const changePassword = api.user.changePassword.useMutation();
  const { register, handleSubmit, reset, watch } = useForm();
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const updatedData = {
        name: data.name,
        email: data.email?.trim() !== "" ? data.email : session?.user?.email,
      };
      await updateProfile.mutateAsync(updatedData);
      toast.success("Profile updated!");
      await update();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsSubmitting(true);
      await changePassword.mutateAsync({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      toast.success("Password changed!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Profile</h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full border-4 border-purple-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg">
              {session?.user?.name?.[0] || "U"}
            </div>
          )}
          <span className="text-lg font-medium text-gray-700">{session?.user?.name}</span>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">Name</label>
            <input
              {...register("name")}
              defaultValue={session?.user?.name ?? ""}
              placeholder="Your name"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              {...register("email")}
              defaultValue={session?.user?.email ?? ""}
              placeholder="Your email"
              type="email"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-3 rounded-md shadow-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Change Password Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 text-center">Change Password</h2>
        <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">Old Password</label>
            <input
              {...register("oldPassword")}
              type="password"
              placeholder="Enter old password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">New Password</label>
            <input
              {...register("newPassword")}
              type="password"
              placeholder="Enter new password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm new password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-md shadow-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
}
