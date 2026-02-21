"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import { apiService } from "@/services/api";
import { MapPin, Calendar, AlertCircle } from "lucide-react";

interface Week {
  week: number;
  focus: string;
  tasks: string[];
  difficulty: string;
  estimatedHours: number;
}

interface RoadmapData {
  weeks: Week[];
}

export default function RoadmapPage() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const result = await apiService.generateRoadmap(selectedRole, [
          "JavaScript",
          "React",
          "TypeScript",
        ]);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [selectedRole]);

  const totalHours = data
    ? data.weeks.reduce((sum, week) => sum + week.estimatedHours, 0)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 pt-24 pb-20">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Your <span className="text-gradient">Career Roadmap</span>
          </h1>
          <p className="text-gray-300 text-lg">
            AI-generated personalized learning path for {selectedRole}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              icon: <MapPin className="w-5 h-5" />,
              label: "Target Role",
              value: selectedRole,
            },
            {
              icon: <Calendar className="w-5 h-5" />,
              label: "Duration",
              value: `${data?.weeks.length || 0} Weeks`,
            },
            {
              icon: <AlertCircle className="w-5 h-5" />,
              label: "Time Commitment",
              value: `~${totalHours} Hours`,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="glassmorphism rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-blue-400">{card.icon}</div>
                <span className="text-xs text-gray-400 font-medium">
                  {card.label}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Role Selector */}
        <motion.div variants={itemVariants} className="mb-12">
          <label className="block text-sm font-semibold text-gray-400 mb-4">
            Switch Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Full Stack Developer",
              "Frontend Engineer",
              "Backend Engineer",
              "DevOps Engineer",
              "Data Engineer",
              "ML Engineer",
            ].map((role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedRole(role);
                  setLoading(true);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 border border-white/20 hover:border-blue-400/50"
                }`}
              >
                {role}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Generating roadmap...</p>
          </motion.div>
        ) : data ? (
          <motion.div variants={itemVariants}>
            <RoadmapTimeline weeks={data.weeks} />
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400">Failed to load roadmap data</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
            Export Roadmap
          </button>
          <button className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
            Share with Mentor
          </button>
          <button className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
            Back to Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
