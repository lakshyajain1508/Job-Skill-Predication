import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Mock data as fallback
const mockAnalysisData = {
  employability_score: 72,
  key_strengths: ["JavaScript", "React", "Node.js"],
  missing_skills: [
    { skill: "AWS", demand: 92, importance: "high" },
    { skill: "Python", demand: 88, importance: "high" },
    { skill: "Docker", demand: 85, importance: "medium" },
    { skill: "TypeScript", demand: 82, importance: "medium" },
  ],
  career_recommendations: [
    "Focus on backend development to increase market value",
    "Learn cloud technologies (AWS or Azure)",
    "Develop DevOps skills",
  ],
};

const mockSkillGapData = {
  current_skills: [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 78 },
    { name: "Node.js", level: 75 },
    { name: "CSS", level: 70 },
  ],
  required_skills: [
    { name: "Python", level: 80 },
    { name: "AWS", level: 75 },
    { name: "Docker", level: 70 },
    { name: "GraphQL", level: 65 },
  ],
};

const mockJobTrendsData = {
  trends: [
    { month: "Jan", demand: 45, salary: 95 },
    { month: "Feb", demand: 52, salary: 98 },
    { month: "Mar", demand: 48, salary: 102 },
    { month: "Apr", demand: 61, salary: 105 },
    { month: "May", demand: 55, salary: 108 },
    { month: "Jun", demand: 67, salary: 110 },
  ],
  top_roles: [
    { role: "Full Stack Developer", demand: 92 },
    { role: "DevOps Engineer", demand: 88 },
    { role: "Data Engineer", demand: 85 },
    { role: "ML Engineer", demand: 82 },
  ],
};

const mockRoadmapData = {
  weeks: [
    {
      week: 1,
      focus: "Python Fundamentals",
      tasks: [
        "Complete Python basics course",
        "Build 3 small projects",
        "Practice data structures",
      ],
      difficulty: "Beginner",
      estimatedHours: 20,
    },
    {
      week: 2,
      focus: "AWS Cloud Basics",
      tasks: [
        "AWS EC2 fundamentals",
        "S3 and storage services",
        "Set up first AWS project",
      ],
      difficulty: "Intermediate",
      estimatedHours: 25,
    },
    {
      week: 3,
      focus: "Docker & Containerization",
      tasks: [
        "Docker basics and CLI",
        "Create Dockerfiles",
        "Docker compose projects",
      ],
      difficulty: "Intermediate",
      estimatedHours: 22,
    },
    {
      week: 4,
      focus: "Integration Project",
      tasks: [
        "Build full project with Python & AWS",
        "Containerize with Docker",
        "Deploy to cloud",
      ],
      difficulty: "Advanced",
      estimatedHours: 30,
    },
  ],
};

const mockDashboardData = {
  employability_score: 72,
  score_trend: [
    { month: "Jan", score: 58 },
    { month: "Feb", score: 62 },
    { month: "Mar", score: 65 },
    { month: "Apr", score: 68 },
    { month: "May", score: 70 },
    { month: "Jun", score: 72 },
  ],
  skills_radar: [
    { skill: "Technical Skills", value: 78 },
    { skill: "Problem Solving", value: 72 },
    { skill: "Communication", value: 65 },
    { skill: "Leadership", value: 60 },
    { skill: "Adaptability", value: 75 },
  ],
  market_demand: [
    { skill: "Python", demand: 95 },
    { skill: "AWS", demand: 92 },
    { skill: "Docker", demand: 88 },
    { skill: "React", demand: 85 },
    { skill: "Kubernetes", demand: 82 },
  ],
  insights: [
    "Your technical skills are above average, focus on soft skills",
    "AWS expertise is highly sought after in your target market",
    "Consider adding DevOps experience to increase marketability",
  ],
};

// API service
export const apiService = {
  async analyzeResume(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_BASE}/analyze-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Resume analysis failed, using mock data:", error);
      return mockAnalysisData;
    }
  },

  async getSkillGap(skills: string[]) {
    try {
      const response = await axios.post(
        `${API_BASE}/skill-gap`,
        { skills },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.warn("Skill gap analysis failed, using mock data:", error);
      return mockSkillGapData;
    }
  },

  async getJobTrends() {
    try {
      const response = await axios.get(`${API_BASE}/job-trends`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.warn("Job trends fetch failed, using mock data:", error);
      return mockJobTrendsData;
    }
  },

  async generateRoadmap(targetRole: string, targetSkills: string[]) {
    try {
      const response = await axios.post(
        `${API_BASE}/generate-roadmap`,
        { targetRole, targetSkills },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.warn("Roadmap generation failed, using mock data:", error);
      return mockRoadmapData;
    }
  },

  async getDashboardData() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard-data`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.warn("Dashboard data fetch failed, using mock data:", error);
      return mockDashboardData;
    }
  },
};
