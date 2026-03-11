import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIResponse from '../utils/Openai.js';

const router = express.Router();

// Create a new chat thread
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "testing new thread"
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
});

// Get all Threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: "Failed fetch thread" });
    }
});

// Get a Thread by ID
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        res.status(500).json({ error: "Failed fetch thread by ID" });
    }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Chat route
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "threadId and message are required" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Get assistant response
        const assistantResponse = await getOpenAIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantResponse });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantResponse });

    } catch (err) {
        console.error("CHAT ERROR:", err);

        res.status(500).json({ error: "Failed to process chat message" });

    }
});

export default router;
