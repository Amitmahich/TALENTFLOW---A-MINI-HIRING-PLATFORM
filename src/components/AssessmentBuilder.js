import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import "../styles/AssessmentBuilder.css";

export default function AssessmentBuilder({ jobId }) {
  const [sections, setSections] = useState([
    {
      id: nanoid(),
      title: "Section 1",
      questions: [
        { id: nanoid(), text: "", options: ["", ""], correctOptionIndex: null },
      ],
    },
  ]);

  // Load existing assessment
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${jobId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.sections) {
          setSections(
            data.sections.map((section) => ({
              ...section,
              id: section.id || nanoid(),
              questions: section.questions.map((q) => ({
                ...q,
                id: q.id || nanoid(),
                correctOptionIndex: q.correctOptionIndex ?? null,
              })),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
      }
    };
    fetchAssessment();
  }, [jobId]);

  // Section handlers
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: nanoid(),
        title: `Section ${sections.length + 1}`,
        questions: [
          {
            id: nanoid(),
            text: "",
            options: ["", ""],
            correctOptionIndex: null,
          },
        ],
      },
    ]);
  };

  const deleteSection = (sectionId) =>
    setSections(sections.filter((s) => s.id !== sectionId));

  const handleSectionTitleChange = (sectionId, value) =>
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, title: value } : s))
    );

  // Question handlers
  const addQuestion = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: nanoid(),
                  text: "",
                  options: ["", ""],
                  correctOptionIndex: null,
                },
              ],
            }
          : section
      )
    );
  };

  const deleteQuestion = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section
      )
    );
  };

  const handleQuestionChange = (sectionId, questionId, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, text: value } : q
              ),
            }
          : section
      )
    );
  };

  // Option handlers
  const addOption = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, options: [...q.options, ""] } : q
              ),
            }
          : section
      )
    );
  };

  const handleOptionChange = (sectionId, questionId, optionIndex, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                      ),
                    }
                  : q
              ),
            }
          : section
      )
    );
  };

  const handleCorrectOptionChange = (sectionId, questionId, optionIndex) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? { ...q, correctOptionIndex: optionIndex }
                  : q
              ),
            }
          : section
      )
    );
  };

  // Disable Save if fields empty
  const isSaveDisabled =
    sections.length === 0 ||
    sections.some(
      (section) =>
        section.title.trim() === "" ||
        section.questions.length === 0 ||
        section.questions.some(
          (q) =>
            q.text.trim() === "" ||
            q.options.some((opt) => opt.trim() === "") ||
            q.correctOptionIndex === null
        )
    );

  // Save / Update assessment via API
  const saveAssessment = async () => {
    try {
      const updatedSections = sections.map((section) => ({
        ...section,
        id: section.id || nanoid(),
        questions: section.questions.map((q) => ({
          ...q,
          id: q.id || nanoid(),
          options: q.options.map((opt) => opt),
          correctOptionIndex: q.correctOptionIndex ?? null,
        })),
      }));

      const response = await fetch(`/api/assessments/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: updatedSections }),
      });

      if (!response.ok) throw new Error("Failed to save assessment");
      const data = await response.json();
      setSections(data.sections);
      alert("Assessment saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving assessment");
    }
  };

  return (
    <div className="assessment-builder">
      {sections.map((section) => (
        <div className="assessment-section" key={section.id}>
          <div className="section-header">
            <input
              className="section-title-input"
              type="text"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) =>
                handleSectionTitleChange(section.id, e.target.value)
              }
            />
            <div className="section-actions">
              <button onClick={() => addQuestion(section.id)}>
                + Add Question
              </button>
              <button onClick={() => deleteSection(section.id)}>
                🗑 Delete Section
              </button>
            </div>
          </div>

          {section.questions.map((q) => (
            <div className="question-card" key={q.id}>
              <input
                type="text"
                className="question-input"
                placeholder="Enter question"
                value={q.text}
                onChange={(e) =>
                  handleQuestionChange(section.id, q.id, e.target.value)
                }
              />
              <div className="options-list">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      className="option-input"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(
                          section.id,
                          q.id,
                          idx,
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="radio"
                      name={`correct-${section.id}-${q.id}`}
                      checked={q.correctOptionIndex === idx}
                      onChange={() =>
                        handleCorrectOptionChange(section.id, q.id, idx)
                      }
                    />
                    <span>Correct</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  className="add-option-btn"
                  onClick={() => addOption(section.id, q.id)}
                >
                  + Add Option
                </button>
                <button
                  className="add-option-btn"
                  style={{ marginLeft: "0.5rem", background: "#ef4444" }}
                  onClick={() => deleteQuestion(section.id, q.id)}
                >
                  🗑 Delete Question
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <button className="add-section-btn" onClick={addSection}>
        + Add Section
      </button>
      <button
        className="save-assessment-btn"
        onClick={saveAssessment}
        disabled={isSaveDisabled}
      >
        💾 Save Assessment
      </button>

      {/* Preview */}
      <div className="assessment-preview">
        <div className="preview-title">Preview</div>
        {sections.map((section) => (
          <div className="preview-section" key={section.id}>
            <strong>{section.title}</strong>
            {section.questions.map((q) => (
              <div className="preview-question" key={q.id}>
                {q.text}
                <ul>
                  {q.options.map((opt, idx) => (
                    <li key={idx}>
                      {opt} {q.correctOptionIndex === idx && "(Correct)"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
