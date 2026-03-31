import express from "express";
import axios from "axios";
import multer from "multer";
import { PDFParse } from "pdf-parse";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

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

// @route POST /api/extract/pdf
// @desc  Extract text from an uploaded PDF buffer
router.post("/pdf", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file provided" });
        }
        
        const parser = new PDFParse({ data: req.file.buffer });
        const data = await parser.getText();
        await parser.destroy();
        
        const text = data.text.trim();
        
        if (!text || text.length < 20) {
            return res.status(422).json({ message: "Could not extract readable text from PDF" });
        }
        
        res.json({ text });
    } catch (error) {
        console.error("PDF extract error:", error.message);
        res.status(500).json({ message: "Failed to parse PDF file" });
    }
});

export default router;
