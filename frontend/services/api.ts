import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// API service
export const apiService = {
  async analyzeResume(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_BASE}/api/analyze-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Resume analysis failed, attempting same-origin fallback:", error);
      // If network error (no response), try same-origin relative path as a fallback
      // This helps when API_BASE points to localhost:8000 but dev proxy or platform uses /api
      try {
        if ((error as AxiosError).isAxiosError && !(error as any).response) {
          const fallback = await axios.post(`/api/analyze-resume`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 10000,
          });
          return fallback.data;
        }
      } catch (fallbackErr) {
        console.error("Fallback analyze-resume failed:", fallbackErr);
        throw fallbackErr;
      }
      throw error;
    }
  },

  async getSkillGap(skills: string[]) {
    try {
      const response = await axios.post(
        `${API_BASE}/api/skill-gap`,
        { skills },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error("Skill gap analysis failed:", error);
      throw error;
    }
  },

  async getJobTrends() {
    try {
      const response = await axios.get(`${API_BASE}/api/job-trends`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.warn("Job trends fetch failed, attempting same-origin fallback:", error);
      try {
        if ((error as AxiosError).isAxiosError && !(error as any).response) {
          const fallback = await axios.get(`/api/job-trends`, { timeout: 10000 });
          return fallback.data;
        }
      } catch (fallbackErr) {
        console.error("Fallback job-trends failed:", fallbackErr);
        throw fallbackErr;
      }
      throw error;
    }
  },

  async generateRoadmap(targetRole: string, targetSkills: string[]) {
    try {
      const response = await axios.post(
        `${API_BASE}/api/generate-roadmap`,
        { targetRole, targetSkills },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error("Roadmap generation failed:", error);
      throw error;
    }
  },

  async getDashboardData() {
    try {
      const response = await axios.get(`${API_BASE}/api/dashboard-data`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
      throw error;
    }
  },
};
