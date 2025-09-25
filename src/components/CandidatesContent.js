import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Use Mirage API instead of direct DB
import "../styles/CandidatesContent.css";

export default function CandidatesContent() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [cRes, jRes] = await Promise.all([
        fetch("/api/candidates"),
        fetch("/api/jobs"),
      ]);
      const cJson = await cRes.json();
      const jJson = await jRes.json();
      setCandidates(cJson.candidates || []);
      setJobs(jJson.jobs || []);
    };
    fetchData();
  }, []);

  // Filter candidates based on search and status
  const filteredCandidates = candidates.filter((c) => {
    const matchesName = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesName && matchesStatus;
  });

  // Get unique statuses dynamically
  const statuses = [
    "All",
    ...Array.from(new Set(candidates.map((c) => c.status))),
  ];

  // Helper to get job title
  const getJobTitle = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    return job ? job.title : "-";
  };

  // Redirect to job detail
  const handleCardClick = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) navigate(`/jobs/${job.slug}`);
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="candidates-grid">
        {filteredCandidates.length === 0 ? (
          <div className="empty-state">
            <p>No candidates have applied yet.</p>
          </div>
        ) : (
          filteredCandidates.map((c) => (
            <div
              className="candidate-card"
              key={c.id}
              onClick={() => handleCardClick(c.jobId)}
              style={{ cursor: "pointer" }}
            >
              <h3>{c.name}</h3>
              <p>Email: {c.email}</p>
              <p>Status: {c.status}</p>
              <p>Job: {getJobTitle(c.jobId)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
