import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "id, slug, status", // sirf searchable fields ko hi index karo
  candidates: "id, jobId, email, stage",
  assessments: "id, jobId, createdAt",
  candidateAnswers: "id, jobId, candidateEmail, createdAt",
});
