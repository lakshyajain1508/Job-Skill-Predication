"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ScoreGauge from "@/components/ScoreGauge";
import Charts from "@/components/Charts";
import { apiService } from "@/services/api";
import { Lightbulb, TrendingUp, Download, Zap, Plus } from "lucide-react";

interface DashboardData {
  employability_score: number;
  candidate_name?: string;
  candidate_age?: number;
  extracted_skills?: string[];
  key_strengths?: string[];
  skills_radar: Array<{ skill: string; value: number }>;
  market_demand: Array<{ skill: string; demand: number }>;
  insights: string[];
  score_trend?: Array<{ month: string; score: number }>;
  jobTrends?: Array<{ month: string; demand: number }>;
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
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // First check for stored analysis result
        const stored = sessionStorage.getItem("analysisResult");
        if (stored) {
          const analysisResult = JSON.parse(stored);
          console.debug("dashboard: loaded analysisResult from sessionStorage", analysisResult);
          
          // Transform analysis result to dashboard data
          let trendsMarketDemand: Array<{ skill: string; demand: number }> = [];
          let mappedJobTrends: Array<{ month: string; demand: number }> | undefined;

          // Fetch job trends (non-blocking); attach if available
          try {
            const jt = await apiService.getJobTrends();
            mappedJobTrends = (jt.trends || jt || []).map((t: any) => ({ month: t.month, demand: t.demand || t.jobs || 0 }));
            trendsMarketDemand = (jt.top_skills || []).slice(0, 5).map((skill: any) => ({
              skill: skill.skill,
              demand: skill.demand,
            }));
            console.debug("dashboard: jobTrends fetched", mappedJobTrends);
          } catch (e) {
            console.warn("Job trends fetch failed:", e);
          }

          const analysisMarketDemand = (analysisResult.missing_skills || []).slice(0, 5).map((skill: any) => ({
            skill: skill.skill,
            demand: skill.demand,
          }));

          const dashboardData: DashboardData = {
            employability_score: analysisResult.employability_score || 0,
            candidate_name: analysisResult.candidate_name || undefined,
            candidate_age: analysisResult.candidate_age || undefined,
            extracted_skills: analysisResult.extracted_skills || undefined,
            key_strengths: analysisResult.key_strengths || undefined,
            skills_radar: [
              { skill: "Technical Skills", value: analysisResult.employability_score || 0 },
              { skill: "Problem Solving", value: Math.max(0, (analysisResult.employability_score || 0) - 5) },
              { skill: "Communication", value: Math.max(0, (analysisResult.employability_score || 0) - 10) },
              { skill: "Leadership", value: Math.max(0, (analysisResult.employability_score || 0) - 15) },
              { skill: "Adaptability", value: Math.max(0, (analysisResult.employability_score || 0) - 5) },
            ],
            market_demand: analysisMarketDemand.length > 0 ? analysisMarketDemand : trendsMarketDemand,
            insights: analysisResult.career_recommendations || [],
            score_trend: [
              { month: "Jan", score: Math.max(0, (analysisResult.employability_score || 0) - 14) },
              { month: "Feb", score: Math.max(0, (analysisResult.employability_score || 0) - 12) },
              { month: "Mar", score: Math.max(0, (analysisResult.employability_score || 0) - 10) },
              { month: "Apr", score: Math.max(0, (analysisResult.employability_score || 0) - 8) },
              { month: "May", score: Math.max(0, (analysisResult.employability_score || 0) - 4) },
              { month: "Jun", score: analysisResult.employability_score || 0 },
            ],
            jobTrends: mappedJobTrends,
          };

          setData(dashboardData);
          setLoading(false);
          return;
        }

        // Fallback to API
        const result = await apiService.getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Show error state
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownloadReport = () => {
    // Generate a simple text report
    if (!data) return;
    
    const report = `
CAREER ANALYSIS REPORT
========================
Generated: ${new Date().toLocaleDateString()}

EMPLOYABILITY SCORE: ${data.employability_score}/100

KEY INSIGHTS:
${data.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

IN-DEMAND SKILLS TO DEVELOP:
${data.market_demand.map((skill, i) => `${i + 1}. ${skill.skill} (Demand: ${skill.demand}%)`).join('\n')}

========================
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', 'career-analysis-report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
        <div className="text-center">
          <p className="text-gray-300 mb-6 text-lg">No analysis data available</p>
          <button
            onClick={() => router.push("/analyze")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            Start Analysis
          </button>
        </div>
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

        {/* Debug Panel - only in non-production */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mb-6">
            <button
              onClick={() => setShowDebug((s) => !s)}
              className="px-3 py-1 bg-white/5 border border-white/20 text-white rounded-md text-sm mb-2"
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>

            {showDebug && (
              <div className="p-4 bg-black/50 border border-white/10 rounded-lg text-sm text-gray-200">
                <div className="mb-3">
                  <strong>Stored analysisResult (sessionStorage):</strong>
                  <pre className="mt-2 max-h-48 overflow-auto p-2 bg-black/70 rounded">{(() => {
                    try {
                      const s = sessionStorage.getItem("analysisResult");
                      return JSON.stringify(s ? JSON.parse(s) : null, null, 2);
                    } catch (e) {
                      return String(e);
                    }
                  })()}</pre>
                </div>

                <div className="mb-3">
                  <strong>jobTrends (fetched):</strong>
                  <pre className="mt-2 max-h-48 overflow-auto p-2 bg-black/70 rounded">{data?.jobTrends ? JSON.stringify(data.jobTrends, null, 2) : "(not loaded)"}</pre>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { sessionStorage.removeItem("analysisResult"); location.reload(); }}
                    className="px-3 py-1 bg-red-600/30 border border-red-600/40 text-red-200 rounded-md text-sm"
                  >
                    Clear analysisResult & reload
                  </button>
                  <button
                    onClick={() => location.reload()}
                    className="px-3 py-1 bg-white/5 border border-white/20 text-white rounded-md text-sm"
                  >
                    Reload
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Score Gauge */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="max-w-md">
            <ScoreGauge
              score={data.employability_score}
              label="Employability Score"
            />
          </div>
        </motion.div>

        {/* Candidate Profile */}
        <motion.div variants={itemVariants} className="mb-12 glassmorphism rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Candidate Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
              <p className="text-white text-lg font-medium">{data.candidate_name || "Not found in resume"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Age</p>
              <p className="text-white text-lg font-medium">{data.candidate_age ?? "Not found in resume"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {(data.extracted_skills && data.extracted_skills.length > 0
                ? data.extracted_skills
                : data.key_strengths || []
              ).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="px-3 py-1 rounded-full text-sm bg-blue-500/15 text-blue-300 border border-blue-400/30"
                >
                  {skill}
                </span>
              ))}
              {(!data.extracted_skills || data.extracted_skills.length === 0) && (!data.key_strengths || data.key_strengths.length === 0) && (
                <span className="text-gray-400 text-sm">No skills extracted</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <Charts
            skillsRadar={data.skills_radar}
            marketDemand={data.market_demand}
            jobTrends={data.jobTrends}
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
          <button
            onClick={handleDownloadReport}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button
            onClick={() => router.push("/roadmap")}
            className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Generate Roadmap
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("analysisResult");
              router.push("/analyze");
            }}
            className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Analysis
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
