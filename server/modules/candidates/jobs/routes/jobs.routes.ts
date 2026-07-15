import { Router } from "express";
import { getAllJobs, getJobById, searchJobs } from "../services/jobs.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    if (search && typeof search === "string") {
      const jobs = await searchJobs(search);
      res.json(jobs);
    } else {
      const jobs = await getAllJobs();
      res.json(jobs);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

export default router;


