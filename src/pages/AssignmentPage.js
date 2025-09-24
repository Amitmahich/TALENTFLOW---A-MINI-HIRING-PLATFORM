import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/Assignment.css";

export default function AssignmentPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { job, candidate } = location.state || {};
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`/api/assessments/${jobId}`);
        const data = await res.json();
        setAssessment(data);
      } catch (err) {}
    };
    fetchAssessment();
  }, [jobId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    // Gather all visible questions (progressive + conditional)
    const visibleQuestions = [];
    assessment.sections.forEach((section) => {
      section.questions.forEach((q, index) => {
        // Same conditional logic as rendering
        if (q.dependsOn) {
          const { questionId, value } = q.dependsOn;
          if (value !== undefined && answers[questionId] !== value) return;
          if (value === undefined && !(questionId in answers)) return;
        } else if (index > 0) {
          const prevQuestion = section.questions[index - 1];
          if (!(prevQuestion.id in answers)) return;
        }
        visibleQuestions.push(q);
      });
    });

    // Check if any visible question is unanswered
    const unanswered = visibleQuestions.filter((q) => !(q.id in answers));
    if (unanswered.length > 0) {
      alert("⚠️ Please answer all questions before submitting!");
      return;
    }

    // Proceed with scoring & saving
    let score = 0;
    visibleQuestions.forEach((q) => {
      if (
        q.correctOptionIndex !== undefined &&
        answers[q.id] === q.correctOptionIndex
      ) {
        score += 1;
      }
    });

    // Save candidate answers
    await fetch("/api/candidate-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        candidateEmail: candidate.email,
        answers,
        score,
      }),
    });

    // Save candidate application (Applied/Completed)
    await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        ...candidate,
        stage: "Completed",
        score,
      }),
    });

    alert(`✅ Assignment submitted! Your score: ${score}`);
    navigate("/candidate");
  };

  if (!assessment) return <p className="loading">⏳ Loading assessment...</p>;
  // Agar assessment hai lekin sections khali hain
  if (!assessment.sections || assessment.sections.length === 0) {
    return (
      <div className="assignment-container">
        <h2>{job?.title || "Assignment"}</h2>
        <p className="no-assignment">
          📭 No assignment available for this job.
        </p>
      </div>
    );
  }

  return (
    <div className="assignment-container">
      <h2>{job?.title || "Assignment"}</h2>

      {assessment.sections.map((section) => (
        <div key={section.id} className="section-card">
          <h3>{section.title}</h3>
          {section.questions.map((q, index) => {
            // Progressive / conditional rendering
            if (q.dependsOn) {
              const { questionId, value } = q.dependsOn;
              if (value !== undefined) {
                if (answers[questionId] !== value) return null;
              } else {
                if (!(questionId in answers)) return null; // previous question answered
              }
            } else if (index > 0) {
              // if no dependsOn, show only after previous question answered
              const prevQuestion = section.questions[index - 1];
              if (!(prevQuestion.id in answers)) return null;
            }

            return (
              <div key={q.id} className="question-card">
                <p>{q.text}</p>
                {q.options?.map((opt, idx) => (
                  <div key={idx}>
                    <label>
                      <input
                        type="radio"
                        name={q.id}
                        value={idx}
                        checked={answers[q.id] === idx}
                        onChange={() => handleAnswerChange(q.id, idx)}
                      />
                      {opt}
                    </label>
                  </div>
                ))}
                {!q.options && (
                  <input
                    type="text"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button className="submit-btn" onClick={handleSubmit}>
        Submit Assignment
      </button>
    </div>
  );
}
