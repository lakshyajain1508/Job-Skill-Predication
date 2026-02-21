"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label?: string;
}

export default function ScoreGauge({ score, label = "Employability Score" }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "#10b981"; // green
    if (s >= 60) return "#3b82f6"; // blue
    if (s >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 glassmorphism rounded-2xl w-full"
    >
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-bold text-gradient"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.div>
          <div className="text-sm text-gray-400 font-medium">/100</div>
        </div>
      </div>

      <p className="text-lg font-semibold text-white text-center">{label}</p>

      {/* Score interpretation */}
      <div className="mt-6 text-center text-sm text-gray-300">
        {score >= 80 ? (
          <p className="text-green-400 font-medium">Excellent - Market Ready! 🚀</p>
        ) : score >= 60 ? (
          <p className="text-blue-400 font-medium">Good - Minor improvements needed 📈</p>
        ) : score >= 40 ? (
          <p className="text-amber-400 font-medium">Fair - Significant growth opportunity ⚡</p>
        ) : (
          <p className="text-red-400 font-medium">Needs Work - Focus on key skills 💪</p>
        )}
      </div>
    </motion.div>
  );
}
