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
  LineChart,
  Line,
} from "recharts";

interface ChartsProps {
  skillsRadar?: Array<{ skill: string; value: number }>;
  marketDemand?: Array<{ skill: string; demand: number }>;
  scoreTrend?: Array<{ month: string; score: number }>;
  jobTrends?: Array<{ month: string; demand: number }>;
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
  skillsRadar = [],
  marketDemand = [],
  jobTrends,
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
      {jobTrends && jobTrends.length > 0 && (
        <motion.div variants={itemVariants} className="glassmorphism rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">Job Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobTrends}>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" tick={{ fill: "#d1d5db", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Line type="monotone" dataKey="demand" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
}
