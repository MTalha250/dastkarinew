import express from "express";
import { createNewsletter, getNewsletters } from "../controllers/newsletter.js";

const router = express.Router();

router.post("/", createNewsletter);
router.get("/", getNewsletters);

export default router;
