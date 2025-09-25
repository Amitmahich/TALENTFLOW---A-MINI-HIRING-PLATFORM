import { useEffect, useState } from "react";
import { db } from "../db";
import "../styles/Dashboard.css";

export default function Dashboard({ hrName = "HR Manager" }) {
  const [jobsCount, setJobsCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [assessmentsCount, setAssessmentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Total jobs posted
        const jobs = await db.jobs.toArray();
        setJobsCount(jobs.length);

        // Total candidates applied
        const candidates = await db.candidates.toArray();
        setCandidatesCount(candidates.length);

        // Total assessments created
        const assessments = await db.assessments.toArray();
        setAssessmentsCount(assessments.length);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <h1>👋 Welcome, {hrName}!</h1>
        <p>Here’s an overview of your hiring dashboard.</p>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card">
          <h2>💼 Jobs Posted</h2>
          <p>{jobsCount}</p>
        </div>
        <div className="metric-card">
          <h2>👥 Total Candidates</h2>
          <p>{candidatesCount}</p>
        </div>
        <div className="metric-card">
          <h2>📊 Active Assessments</h2>
          <p>{assessmentsCount}</p>
        </div>
      </div>
    </div>
  );
}
