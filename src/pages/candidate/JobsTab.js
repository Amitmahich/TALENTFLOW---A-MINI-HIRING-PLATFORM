export default function JobsTab({
  jobs,
  appliedJobs,
  openApplyModal,
  navigate,
  candidateInput,
}) {
  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="empty">No active jobs available</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <div className="job-tags">
                {job.tags?.map((tag, idx) => (
                  <span key={idx} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <p>Salary: {job.salary || "N/A"}</p>
              <button onClick={() => openApplyModal(job)}>Apply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
