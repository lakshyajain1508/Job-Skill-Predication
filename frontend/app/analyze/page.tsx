"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import UploadBox from "@/components/UploadBox";
import SkillTags from "@/components/SkillTags";
import { apiService } from "@/services/api";
import { Zap } from "lucide-react";

const TECH_ROLES = [
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "DevOps Engineer",
  "Data Engineer",
  "ML Engineer",
  "System Architect",
  "Cloud Architect",
];

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    if (!selectedRole) {
      setError("Please select a target role");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("skills", JSON.stringify(skills));
      formData.append("target_role", selectedRole);

      const result = await apiService.analyzeResume(formData);
      
      // Store result in sessionStorage for dashboard
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 border border-blue-500/20 mb-4">
            <Zap className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              AI Resume Analysis
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Analyze Your <span className="text-gradient">Career</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upload your resume and provide your skills to get AI-powered insights
            about your employability and personalized career recommendations.
          </p>
        </motion.div>

        {/* Main Form */}
        <div className="space-y-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-lg font-semibold text-white mb-4">
              Upload Resume
            </label>
            <UploadBox onFileUpload={setFile} loading={loading} />
            {file && (
              <motion.p
                className="text-green-400 text-sm mt-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ {file.name} selected
              </motion.p>
            )}
          </motion.div>

          {/* Skills Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SkillTags skills={skills} onSkillsChange={setSkills} />
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <label className="block text-lg font-semibold text-white">
              Target Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TECH_ROLES.map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 ${
                    selectedRole === role
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50"
                      : "bg-white/5 text-gray-300 border border-white/20 hover:border-blue-400/50 hover:bg-white/10"
                  }`}
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 pt-4"
          >
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Analyze Resume"
              )}
            </button>
            <button
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-4 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 disabled:opacity-50 transition-all duration-300"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
