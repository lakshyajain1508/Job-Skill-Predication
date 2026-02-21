"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScoreGauge from "@/components/ScoreGauge";
import Charts from "@/components/Charts";
import { apiService } from "@/services/api";
import { Lightbulb, TrendingUp } from "lucide-react";

interface DashboardData {
  employability_score: number;
  skills_radar: Array<{ skill: string; value: number }>;
  market_demand: Array<{ skill: string; demand: number }>;
  insights: string[];
  score_trend?: Array<{ month: string; score: number }>;
}

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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await apiService.getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 pt-24 pb-20">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Career <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Your comprehensive career intelligence overview
          </p>
        </motion.div>

        {/* Score Gauge */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="max-w-md">
            <ScoreGauge
              score={data.employability_score}
              label="Employability Score"
            />
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <Charts
            skillsRadar={data.skills_radar}
            marketDemand={data.market_demand}
          />
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div
          variants={itemVariants}
          className="glassmorphism rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.insights.map((insight, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap gap-4"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
            Download Report
          </button>
          <button className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
            Generate Roadmap
          </button>
          <button className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
            New Analysis
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
