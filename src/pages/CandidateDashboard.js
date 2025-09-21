import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CandidateDashboard.css";
import AppliedTab from "./candidate/AppliedTab";
import JobsTab from "./candidate/JobsTab";
import ProfileTab from "./candidate/ProfileTab";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidateInput, setCandidateInput] = useState({ name: "", email: "" });

  const navigate = useNavigate();

  // Fetch all active jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/candidate/jobs");
        const data = await res.json();
        setJobs(data.jobs);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applied jobs for this candidate
  useEffect(() => {
    if (!candidateInput.email) return;

    const fetchApplied = async () => {
      try {
        const res = await fetch(`/api/candidates/${candidateInput.email}`);
        const data = await res.json();
        setAppliedJobs(data);
      } catch (err) {}
    };
    fetchApplied();
  }, [candidateInput.email]);

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    if (!candidateInput.name || !candidateInput.email) {
      alert("Please enter your name and email");
      return;
    }

    // Check if candidate already applied for this job
    const alreadyApplied = appliedJobs.some(
      (job) =>
        job.jobId === selectedJob.id && job.email === candidateInput.email
    );
    if (alreadyApplied) {
      alert("⚠️ You have already applied for this job!");
      setShowApplyModal(false);
      return;
    }

    try {
      // Save candidate application
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob.id, ...candidateInput }),
      });
      const data = await res.json();

      // Update appliedJobs state immediately
      const appliedJob = {
        ...selectedJob,
        ...data,
        stage: "Applied",
        score: null,
      };
      setAppliedJobs((prev) => [...prev, appliedJob]);

      setShowApplyModal(false);

      // Navigate to AssignmentPage
      navigate(`/candidate/assignment/${selectedJob.id}`, {
        state: { job: appliedJob, candidate: candidateInput },
      });
    } catch (err) {}
  };

  // Filter available jobs (exclude applied ones)
  const availableJobs = jobs.filter(
    (job) => !appliedJobs.some((applied) => applied.jobId === job.id)
  );

  return (
    <div className="candidate-dashboard">
      <nav className="candidate-navbar">
        <div className="navbar-logo">TalentFlow</div>
        <ul className="navbar-links">
          <li onClick={() => setActiveTab("jobs")}>Jobs</li>
          <li onClick={() => setActiveTab("applied")}>Applied</li>
          <li onClick={() => setActiveTab("profile")}>Profile</li>
        </ul>
      </nav>

      <div className="dashboard-content">
        {loading ? (
          <p className="loading-message">⏳ Loading jobs...</p> // ✅ used loading
        ) : (
          <>
            {activeTab === "jobs" && (
              <JobsTab
                jobs={availableJobs}
                appliedJobs={appliedJobs}
                openApplyModal={openApplyModal}
                navigate={navigate}
                candidateInput={candidateInput}
              />
            )}
            {activeTab === "applied" && (
              <AppliedTab
                appliedJobs={appliedJobs}
                navigate={navigate}
                candidateInput={candidateInput}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                candidateInput={candidateInput}
                setCandidateInput={setCandidateInput}
              />
            )}
          </>
        )}
      </div>

      {showApplyModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Your Details</h3>
            <input
              type="text"
              placeholder="Name"
              value={candidateInput.name}
              onChange={(e) =>
                setCandidateInput({ ...candidateInput, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={candidateInput.email}
              onChange={(e) =>
                setCandidateInput({ ...candidateInput, email: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button onClick={submitApplication}>Submit</button>
              <button onClick={() => setShowApplyModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
