import { createServer } from "miragejs";
import { nanoid } from "nanoid";
import { db } from "../db";
import { seedData } from "../seedData";

export async function makeServer() {
  const server = createServer({
    routes() {
      this.namespace = "api";

      // ======================
      // Jobs (HR + Candidate)
      // ======================
      this.get("/jobs", async () => {
        const jobs = await db.jobs.toArray();
        return { jobs, total: jobs.length };
      });

      // Get a single job by id
      this.get("/jobs/:id", async (_, request) => {
        const id = request.params.id;
        const job = await db.jobs.get(Number(id) || id);
        return job || {};
      });

      this.get("/candidate/jobs", async () => {
        const jobs = await db.jobs.where("status").equals("active").toArray();
        return { jobs, total: jobs.length };
      });

      this.post("/jobs", async (_, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = nanoid();
        await db.jobs.add(attrs);
        return attrs;
      });

      // Update a job by id
      this.put("/jobs/:id", async (_, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        await db.jobs.update(Number(id) || id, attrs);
        const updated = await db.jobs.get(Number(id) || id);
        return updated;
      });

      // Toggle archive (status) helper
      this.post("/jobs/:id/toggle-archive", async (_, request) => {
        const id = request.params.id;
        const job = await db.jobs.get(Number(id) || id);
        if (!job) return {};
        const newStatus = job.status === "active" ? "archived" : "active";
        await db.jobs.update(Number(id) || id, { status: newStatus });
        return { ...job, status: newStatus };
      });

      // ======================
      // Candidates
      // ======================
      this.get("/candidates", async () => {
        const list = await db.candidates.toArray();
        return { candidates: list, total: list.length };
      });
      this.post("/candidates", async (_, request) => {
        const attrs = JSON.parse(request.requestBody);
        // Normalize stage/status for UI filters
        attrs.stage = attrs.stage || "Applied";
        attrs.status = attrs.status || attrs.stage;

        // Check if candidate already exists for this job
        let existing = await db.candidates
          .where("jobId")
          .equals(attrs.jobId)
          .and((c) => c.email === attrs.email)
          .first();

        if (existing) {
          // update instead of duplicate insert
          existing = { ...existing, ...attrs, stage: attrs.stage, status: attrs.status };
          await db.candidates.put(existing);
          return existing;
        }

        // new candidate
        attrs.id = nanoid();
        await db.candidates.add(attrs);
        return attrs;
      });

      this.put("/candidates/:id", async (_, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        await db.candidates.update(id, attrs);
        const updated = await db.candidates.get(id);
        return updated;
      });

      this.get("/candidates/:email", async (_, request) => {
        const email = request.params.email;
        const applied = await db.candidates
          .where("email")
          .equals(email)
          .toArray();
        return applied;
      });

      // ======================
      // Candidate Answers
      // ======================
      this.post("/candidate-answers", async (_, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = nanoid();
        attrs.submittedAt = new Date().toISOString();
        await db.candidateAnswers.add(attrs);
        return attrs;
      });

      this.get("/candidate-answers/:jobId/:email", async (_, request) => {
        const { jobId, email } = request.params;
        const answers = await db.candidateAnswers
          .where("jobId")
          .equals(jobId)
          .and((a) => a.candidateEmail === email)
          .first();
        return answers || {};
      });

      // ======================
      // Assessments
      // ======================
      this.get("/assessments/:jobId", async (_, request) => {
        const jobId = request.params.jobId;
        const assessment = await db.assessments
          .where("jobId")
          .equals(jobId)
          .first();
        return assessment || { jobId, sections: [] };
      });

      this.put("/assessments/:jobId", async (_, request) => {
        const jobId = request.params.jobId;
        const attrs = JSON.parse(request.requestBody);

        let assessment = await db.assessments
          .where("jobId")
          .equals(jobId)
          .first();

        if (assessment) {
          // update existing
          assessment.sections = attrs.sections;
          await db.assessments.put(assessment);
        } else {
          // create new
          assessment = { id: nanoid(), jobId, sections: attrs.sections };
          await db.assessments.add(assessment);
        }

        return assessment;
      });
    },
  });

  await seedData(); // ensure data is seeded before app queries IndexedDB
  return server;
}
