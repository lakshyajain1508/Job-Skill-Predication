"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface SkillTagsProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  suggestedSkills?: string[];
}

const SUGGESTED_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "AWS",
  "Docker",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Kubernetes",
  "Machine Learning",
  "Data Science",
  "DevOps",
];

export default function SkillTags({
  skills,
  onSkillsChange,
  suggestedSkills = SUGGESTED_SKILLS,
}: SkillTagsProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(inputValue.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <label className="block text-lg font-semibold text-white">
        Your Skills
      </label>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a skill and press Enter..."
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300"
        />
      </div>

      {/* Selected Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/50 rounded-full text-sm text-blue-300"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-blue-200 transition-colors"
                  title={`Remove ${skill} skill`}
                  aria-label={`Remove ${skill} skill`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Suggested Skills */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">Suggested skills:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter((s) => !skills.includes(s))
            .slice(0, 8)
            .map((skill) => (
              <motion.button
                key={skill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-gray-300 hover:text-white transition-all duration-300"
              >
                + {skill}
              </motion.button>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
