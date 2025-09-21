import { useEffect, useState } from "react";
import { db } from "../../db";

export default function AppliedTab({ appliedJobs, navigate, candidateInput }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsData = await db.jobs.toArray();
      setJobs(jobsData);
    };
    fetchJobs();
  }, []);

  // helper to get job title
  const getJobTitle = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    return job ? job.title : "Untitled Job";
  };

  return (
    <div>
      <h2>Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <p className="empty">You have not applied to any job yet</p>
      ) : (
        <div className="jobs-grid">
          {appliedJobs.map((job) => (
            <div key={job.jobId} className="job-card">
              {/* Job Title */}
              <h3>{getJobTitle(job.jobId)}</h3>

              {/* Tags */}
              <div className="job-tags">
                {job.tags?.map((tag, idx) => (
                  <span key={idx} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Salary */}
              <p>Salary: {job.salary || "N/A"}</p>

              {/* Status */}
              <p>
                <strong>Status:</strong> {job.stage || "Applied"}
              </p>

              {/* Score (optional) */}
              {job.score !== null && (
                <p>
                  <strong>Score:</strong> {job.score}
                </p>
              )}

              {/* Disabled Applied Button */}
              <button disabled className="applied-btn">
                Applied
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
