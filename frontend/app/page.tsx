"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      <motion.section
        className="relative pt-20 pb-40 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 border border-blue-500/20">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  Powered by AI Intelligence
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl font-bold tracking-tighter mb-8"
            >
              <span className="text-gradient">
                Your AI Career
              </span>
              <br />
              <span className="text-white">Intelligence Platform</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              CareerPilot AI analyzes your resume and skills against market trends
              to provide personalized career intelligence, skill gap analysis, and
              AI-generated roadmaps for career advancement.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/analyze">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg font-semibold text-white overflow-hidden hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                  <span className="relative flex items-center justify-center">
                    Start Analysis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-white transition-all duration-300 backdrop-blur-sm">
                  View Dashboard
                </button>
              </Link>
            </motion.div>

            {/* Stats / Features */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
            >
              {[
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Market Insights",
                  desc: "Real-time job market analytics",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Skill Analysis",
                  desc: "AI-powered skill gap detection",
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "AI Roadmap",
                  desc: "Personalized career pathways",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-blue-400 mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* AI Explanation Section */}
          <motion.section
            variants={itemVariants}
            className="mt-20 pt-20 border-t border-white/10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              How <span className="text-gradient">CareerPilot AI</span> Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Upload Resume",
                  desc: "Submit your resume and current skills. Our AI extracts key information instantly.",
                },
                {
                  step: "02",
                  title: "Market Analysis",
                  desc: "We analyze current job market trends and identify in-demand skills.",
                },
                {
                  step: "03",
                  title: "Gap Identification",
                  desc: "AI identifies skill gaps between your profile and market demands.",
                },
                {
                  step: "04",
                  title: "Smart Roadmap",
                  desc: "Get a personalized weekly roadmap to bridge your skill gaps.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glassmorphism p-8 rounded-2xl group hover:bg-white/15 transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.section>
    </div>
  );
}
