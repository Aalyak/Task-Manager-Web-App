import express from "express";
import Groq from "groq-sdk";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/suggest
// Body: { title: "fix login bug" }
// Returns: { description: "...", priority: "High" }
router.post("/suggest", protect, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const prompt = `You are a task management assistant. A user gave this rough task title: "${title}"

Generate:
1. A clear, professional 1-2 sentence description of what this task involves.
2. A priority level: exactly one of "Low", "Medium", or "High".

Respond ONLY with valid JSON in this exact format, no other text:
{"description": "...", "priority": "Low|Medium|High"}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback if the model didn't return clean JSON
      return res.json({
        description: cleaned || `Complete the task: ${title}`,
        priority: "Medium",
      });
    }

    const validPriorities = ["Low", "Medium", "High"];
    if (!validPriorities.includes(parsed.priority)) {
      parsed.priority = "Medium";
    }

    res.json(parsed);
  } catch (err) {
    console.error("AI suggestion error:", err.message);
    res.status(500).json({
      message: "AI suggestion failed. You can still fill in the task manually.",
      error: err.message,
    });
  }
});

export default router;
