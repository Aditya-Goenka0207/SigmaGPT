import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing New Thread",
    });

    const response = await thread.save();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save in DB!" });
  }
});

// get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({})
      .sort({ updatedAt: -1 })
      .select("threadId title updatedAt");

    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch threads!" });
  }
});

// get individual thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found!" });
    }

    res.json(thread.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch thread!" });
  }
});

// delete individual thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ message: "Thread not found!" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete thread!" });
  }
});

// chat functionality
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message || message.trim() === "") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // create a new thread
      thread = new Thread({
        threadId,
        title: message.substring(0, 40),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    //sending conversation context instead of single message
    const assistantReply = await getOpenAIAPIResponse(
      thread.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    );

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create chat!" });
  }
});

export default router;
