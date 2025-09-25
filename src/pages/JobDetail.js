import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentBuilder from "../components/AssessmentBuilder";
import "../styles/JobDetail.css";

export default function JobDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignmentExists, setAssignmentExists] = useState(false);

  const [columns, setColumns] = useState({
    applied: [],
    screen: [],
    tech: [],
    offer: [],
    hired: [],
    rejected: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const jobsRes = await fetch("/api/jobs");
      const jobsJson = await jobsRes.json();
      const jobs = jobsJson.jobs || [];

      const foundJob =
        jobs.find((j) => j.slug?.toLowerCase() === slug.toLowerCase()) ||
        jobs.find((j) => j.title?.toLowerCase() === slug.toLowerCase());

      if (!foundJob) {
        setLoading(false);
        return;
      }

      setJob(foundJob);

      // Reset columns
      const cols = {
        applied: [],
        screen: [],
        tech: [],
        offer: [],
        hired: [],
        rejected: [],
      };

      // Fetch candidates
      const candRes = await fetch("/api/candidates");
      const candJson = await candRes.json();
      const candidates = (candJson.candidates || []).filter(
        (c) => c.jobId === foundJob.id
      );

      candidates.forEach((c) => {
        let status = c.status?.toLowerCase() || "applied";
        if (status === "screening") status = "screen";
        else if (status === "interviewing") status = "tech";
        else if (status === "offer made") status = "offer";
        else if (status === "applied") status = "applied";
        else if (status === "hired") status = "hired";
        else if (status === "rejected") status = "rejected";

        if (!cols[status]) cols[status] = [];
        cols[status].push(c);
      });

      setColumns(cols);

      // Candidate count
      foundJob.candidates = candidates.length;
      setJob(foundJob);

      // Check if assignment exists
      const assessRes = await fetch(`/api/assessments/${foundJob.id}`);
      const existingAssessment = await assessRes.json();
      setAssignmentExists(!!existingAssessment && !!existingAssessment.sections);

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <p className="loading">⏳ Loading job...</p>;
  if (!job) return <p className="not-found">⚠️ Job not found!</p>;

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const prevColumns = JSON.parse(JSON.stringify(columns));

    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);
    const [moved] = sourceCol.splice(source.index, 1);

    // Update status to destination column (lowercase for DB consistency)
    moved.status = destination.droppableId.toLowerCase();

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, moved);
      setColumns((prev) => ({ ...prev, [source.droppableId]: sourceCol }));
    } else {
      destCol.splice(destination.index, 0, moved);
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }));
    }

    try {
      // ✅ Update in IndexedDB using lowercase status
      await fetch(`/api/candidates/${moved.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: moved.status }),
      });

      // Refresh columns from DB to ensure accurate counts
      const cRes = await fetch("/api/candidates");
      const cJson = await cRes.json();
      const updatedCandidates = (cJson.candidates || []).filter(
        (c) => c.jobId === job.id
      );

      const updatedColumns = {
        applied: [],
        screen: [],
        tech: [],
        offer: [],
        hired: [],
        rejected: [],
      };

      updatedCandidates.forEach((c) => {
        const status = c.status?.toLowerCase() || "applied";
        if (!updatedColumns[status]) updatedColumns[status] = [];
        updatedColumns[status].push(c);
      });

      setColumns(updatedColumns);
      setJob((prev) => ({ ...prev, candidates: updatedCandidates.length }));
    } catch (err) {
      setColumns(prevColumns);
      alert("⚠️ Failed to update candidate. Please try again.");
    }
  };

  return (
    <div className="job-detail-container">
      {/* Header */}
      <div className="job-detail-header">
        <div className="job-info">
          <h1 className="job-title">{job.title}</h1>

          <div className="job-meta">
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Tags:</strong> {job.tags?.join(", ") || "No tags"}
            </p>
            <p>
              <strong>Required Skills:</strong>{" "}
              {job.requiredSkills?.join(", ") || "-"}
            </p>
            <p>
              <strong>Preferred Skills:</strong>{" "}
              {job.preferredSkills?.join(", ") || "-"}
            </p>
            <p>
              <strong>Salary / CTC:</strong> {job.salary || "-"}
            </p>
            <p>
              <strong>Location:</strong> {job.location || "-"}
            </p>
            <p>
              <strong>Work Type:</strong> {job.workType || "-"}
            </p>
            <p>👥 {job.candidates} candidates applied</p>
          </div>

          <div className="assessment-btn-container">
            {!assignmentExists ? (
              <button
                className="create-assessment-btn"
                onClick={() => setModalOpen(true)}
              >
                ➕ Create Assessment
              </button>
            ) : (
              <button
                className="view-assessment-btn"
                onClick={() => setModalOpen(true)}
              >
                👁 View Assignment
              </button>
            )}
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate("/JobsContent")}>
          🔙 Back
        </button>
      </div>

      <hr />

      <h2 className="all-candidates-title">All Candidates</h2>

      <div className="kanban-board">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([colName, items]) => (
            <Droppable droppableId={colName} key={colName}>
              {(provided, snapshot) => (
                <div
                  className={`kanban-column ${
                    snapshot.isDraggingOver ? "drag-over" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="column-title">
                    {colName} <span className="count">({items.length})</span>
                  </h3>

                  <div className="candidate-list">
                    {items.map((candidate, index) => (
                      <Draggable
                        draggableId={candidate.id.toString()}
                        index={index}
                        key={candidate.id}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`candidate-card ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="candidate-name">
                              <strong>{candidate.name}</strong>
                            </p>
                            <p className="candidate-email">{candidate.email}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>
            <AssessmentBuilder jobId={job.id} />
          </div>
        </div>
      )}
    </div>
  );
}
