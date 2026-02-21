"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  CartesianGrid,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartsProps {
  skillsRadar?: Array<{ skill: string; value: number }>;
  marketDemand?: Array<{ skill: string; demand: number }>;
  scoreTrend?: Array<{ month: string; score: number }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function Charts({
  skillsRadar = [
    { skill: "Technical", value: 78 },
    { skill: "Problem Solving", value: 72 },
    { skill: "Communication", value: 65 },
    { skill: "Leadership", value: 60 },
    { skill: "Adaptability", value: 75 },
  ],
  marketDemand = [
    { skill: "Python", demand: 95 },
    { skill: "AWS", demand: 92 },
    { skill: "Docker", demand: 88 },
    { skill: "React", demand: 85 },
    { skill: "Kubernetes", demand: 82 },
  ],
}: ChartsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Skill Radar Chart */}
      <motion.div
        variants={itemVariants}
        className="glassmorphism rounded-2xl p-6 flex flex-col items-center min-h-96"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Skills Profile</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={skillsRadar}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "#d1d5db", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af" }} />
            <Radar
              name="Your Skills"
              dataKey="value"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.6}
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Market Demand Chart */}
      <motion.div
        variants={itemVariants}
        className="glassmorphism rounded-2xl p-6 flex flex-col min-h-96"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Market Demand</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={marketDemand}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="skill" tick={{ fill: "#d1d5db", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar
              dataKey="demand"
              fill="#06b6d4"
              animationDuration={1200}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
