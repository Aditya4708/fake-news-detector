import express from "express";
import axios from "axios";

const router = express.Router();

function extractTextFromHtml(html) {
    // loose extraction: remove scripts/styles and tags, preserve spaces + major blocks
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<!--[^>]*-->/g, " ")
        .replace(/<br\s*\/?\s*>/gi, "\n")
        .replace(/<p\s*\/?\s*>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// @route GET /api/extract?url=...
// @desc  Fetch URL and return plain text
router.get("/", async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "Missing URL parameter" });
    }

    try {
        const response = await axios.get(url, { timeout: 20000, responseType: "text" });
        const html = response.data;
        const text = extractTextFromHtml(html);

        if (!text || text.length < 20) {
            return res.status(422).json({ message: "Could not extract sufficient text from URL" });
        }

        res.json({ text });
    } catch (error) {
        console.error("URL extract error", error.message);
        res.status(500).json({ message: "Failed to fetch URL" });
    }
});

export default router;
