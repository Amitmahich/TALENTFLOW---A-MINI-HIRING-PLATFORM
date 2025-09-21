import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "id, title, slug, status, order, tags, requiredSkills, preferredSkills, salary, location, workType, candidates",
  candidates: "id, jobId, name, email, stage", // stage = Applied / Screening / Interview / Offer / Hired
  assessments: "id, jobId, sections, createdAt, updatedAt",
  candidateAnswers: "id, jobId, candidateEmail, answers, score, createdAt", // New table
});
