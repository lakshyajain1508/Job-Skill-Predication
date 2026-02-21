"use client";

import { motion } from "framer-motion";
import { Check, Clock, Zap } from "lucide-react";

interface TimelineItem {
  week: number;
  focus: string;
  tasks: string[];
  difficulty: string;
  estimatedHours: number;
}

interface RoadmapTimelineProps {
  weeks?: TimelineItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "intermediate":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "advanced":
      return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/50";
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return <Zap className="w-4 h-4" />;
    case "intermediate":
      return <Clock className="w-4 h-4" />;
    case "advanced":
      return <Zap className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export default function RoadmapTimeline({
  weeks = [
    {
      week: 1,
      focus: "Python Fundamentals",
      tasks: ["Complete Python basics course", "Build 3 small projects"],
      difficulty: "Beginner",
      estimatedHours: 20,
    },
    {
      week: 2,
      focus: "AWS Cloud Basics",
      tasks: ["AWS EC2 fundamentals", "S3 and storage services"],
      difficulty: "Intermediate",
      estimatedHours: 25,
    },
    {
      week: 3,
      focus: "Docker & Containerization",
      tasks: ["Docker basics and CLI", "Create Dockerfiles"],
      difficulty: "Intermediate",
      estimatedHours: 22,
    },
    {
      week: 4,
      focus: "Integration Project",
      tasks: ["Build full project", "Deploy to cloud"],
      difficulty: "Advanced",
      estimatedHours: 30,
    },
  ],
}: RoadmapTimelineProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {weeks.map((week, index) => (
        <motion.div
          key={week.week}
          variants={itemVariants}
          className="relative pl-8 pb-8"
        >
          {/* Timeline line */}
          {index !== weeks.length - 1 && (
            <div className="absolute left-3 top-12 w-0.5 h-20 bg-gradient-to-b from-blue-400 to-transparent opacity-50" />
          )}

          {/* Timeline dot */}
          <motion.div
            className="absolute left-0 top-0 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-4 border-dark-950 glow"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          {/* Content */}
          <div className="glassmorphism rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                    Week {week.week}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1 ${getDifficultyColor(
                      week.difficulty
                    )}`}
                  >
                    {getDifficultyIcon(week.difficulty)}
                    {week.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{week.focus}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{week.estimatedHours}h</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {week.tasks.map((task, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 text-gray-300 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <div className="mt-1">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>{task}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
