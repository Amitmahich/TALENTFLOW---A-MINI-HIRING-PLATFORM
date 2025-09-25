import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { seedData } from "../../src/seedData";
import "../styles/JobsContent.css";

export default function JobsContent() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editJobId, setEditJobId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form fields
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [reqSkillInput, setReqSkillInput] = useState("");
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [prefSkillInput, setPrefSkillInput] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");

  const resetForm = () => {
    setTitle("");
    setTags([]);
    setTagInput("");
    setRequiredSkills([]);
    setReqSkillInput("");
    setPreferredSkills([]);
    setPrefSkillInput("");
    setSalary("");
    setLocation("");
    setWorkType("");
    setError("");
    setEditJobId(null);
  };

  // Fetch jobs with candidate count
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      const candRes = await fetch("/api/candidates");
      const candData = await candRes.json();
      const candidateCounts = (candData.candidates || []).reduce((acc, c) => {
        acc[c.jobId] = (acc[c.jobId] || 0) + 1;
        return acc;
      }, {});
      const jobsWithCount = (data.jobs || []).map((j) => ({
        ...j,
        candidates: candidateCounts[j.id] || 0,
      }));
      setJobs(jobsWithCount);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchJobs();
  // }, []);
  useEffect(() => {
    const init = async () => {
      await seedData();
      await fetchJobs();
    };
    init();
  }, []);

  // Helper to add tag or skill
  const handleAddItem = (e, input, setInput, list, setList) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
    setInput("");
  };

  const removeItem = (item, list, setList) =>
    setList(list.filter((i) => i !== item));

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("⚠️ Job title is required");
    if (tags.length === 0) return setError("⚠️ At least one tag is required");
    if (requiredSkills.length === 0)
      return setError("⚠️ Required skills are needed");

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    if (editJobId) {
      // Edit existing job
      const updatedJob = {
        title,
        slug,
        tags,
        requiredSkills,
        preferredSkills,
        salary,
        location,
        workType,
      };
      await fetch(`/api/jobs/${editJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });
      await fetchJobs();
      resetForm();
      setShowForm(false);
      return;
    }

    if (jobs.some((job) => job.slug === slug))
      return setError("⚠️ Job with similar title exists");

    const newJob = {
      id: Date.now(),
      title,
      slug,
      status: "active",
      tags,
      requiredSkills,
      preferredSkills,
      salary,
      location,
      workType,
      order: Date.now(),
    };

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    await fetchJobs();
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (job) => {
    setTitle(job.title);
    setTags(job.tags || []);
    setRequiredSkills(job.requiredSkills || []);
    setPreferredSkills(job.preferredSkills || []);
    setSalary(job.salary || "");
    setLocation(job.location || "");
    setWorkType(job.workType || "");
    setEditJobId(job.id);
    setShowForm(true);
  };

  const toggleArchive = async (id) => {
    await fetch(`/api/jobs/${id}/toggle-archive`, { method: "POST" });
    await fetchJobs();
  };

  const displayedJobs = jobs
    .filter((job) =>
      filterStatus === "all" ? true : job.status === filterStatus
    )
    .filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase().trim())
    );

  return (
    <div className="jobs-content">
      {/* Search + Filter */}
      <div className="jobs-topbar">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">⏳ Loading jobs...</p>
      ) : displayedJobs.length === 0 ? (
        <p className="empty">No jobs found. Create one!</p>
      ) : (
        <div className="jobs-grid">
          {displayedJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => navigate(`/jobs/${job.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className={`status ${job.status}`}>{job.status}</span>
              </div>

              <div className="job-tags">
                {job.tags.length > 0 ? (
                  job.tags.map((tag, idx) => (
                    <span key={idx} className="job-tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="no-tags">⚠️ No tags</span>
                )}
              </div>

              <p className="job-stats">
                👥 {job.candidates} candidates applied
              </p>

              <div className="job-actions" onClick={(e) => e.stopPropagation()}>
                <button className="edit-btn" onClick={() => handleEdit(job)}>
                  ✏️ Edit
                </button>
                <button
                  className="archive-btn"
                  onClick={() => toggleArchive(job.id)}
                >
                  {job.status === "active" ? "📦 Archive" : "📂 Unarchive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setShowForm(true)}>
        ➕
      </button>

      {/* Modal */}
      {showForm && (
        <div
          className="overlay"
          onClick={() => {
            resetForm();
            setShowForm(false);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editJobId ? "Edit Job" : "Create Job"}</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleAddJob}>
              <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Tags */}
              <div className="tags-input">
                <input
                  type="text"
                  placeholder="Add tag & press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleAddItem(e, tagInput, setTagInput, tags, setTags)
                  }
                />
                <div className="tags-list">
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeItem(tag, tags, setTags)}
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="tags-input">
                <input
                  type="text"
                  placeholder="Required Skills & press Enter"
                  value={reqSkillInput}
                  onChange={(e) => setReqSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleAddItem(
                      e,
                      reqSkillInput,
                      setReqSkillInput,
                      requiredSkills,
                      setRequiredSkills
                    )
                  }
                />
                <div className="tags-list">
                  {requiredSkills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(skill, requiredSkills, setRequiredSkills)
                        }
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="tags-input">
                <input
                  type="text"
                  placeholder="Preferred Skills & press Enter"
                  value={prefSkillInput}
                  onChange={(e) => setPrefSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleAddItem(
                      e,
                      prefSkillInput,
                      setPrefSkillInput,
                      preferredSkills,
                      setPreferredSkills
                    )
                  }
                />
                <div className="tags-list">
                  {preferredSkills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(skill, preferredSkills, setPreferredSkills)
                        }
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <input
                type="text"
                placeholder="Salary / CTC / Range"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />

              {/* Location */}
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              {/* Work Type */}
              <input
                type="text"
                placeholder="Work Type"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />

              <div className="actions">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit">{editJobId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
