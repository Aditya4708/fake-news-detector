import express from "express";
import protect from "../middleware/authMiddleware.js";
import { analyzeArticle } from "../utils/openrouter.js";
import computeConsensus from "../utils/consensus.js";
import Search from "../models/Search.js";

const router = express.Router();

// @route   POST /api/analyze
// @desc    Analyze article text using 4 distributed AI nodes
// @access  Protected
router.post("/", protect, async (req, res) => {
    const { articleText } = req.body;

    try {
        if (!articleText || articleText.trim().length < 20) {
            return res.status(400).json({
                message: "Please provide article text (minimum 20 characters).",
            });
        }

        if (articleText.length > 20000) {
            return res.status(400).json({
                message: "Article text too long. Maximum 20,000 characters.",
            });
        }

        console.log(`🔍 Analysis requested by user ${req.user._id}`);
        console.log(`📝 Article length: ${articleText.length} characters`);

        // Fire all 4 AI nodes in parallel (distributed processing)
        const startTime = Date.now();
        const nodeResults = await analyzeArticle(articleText);
        const totalTime = Date.now() - startTime;

        console.log(`⚡ All nodes responded in ${totalTime}ms`);

        // Run consensus voting
        const { finalVerdict, consensusScore, votingDetails } =
            computeConsensus(nodeResults);

        console.log(`🗳️ Consensus: ${finalVerdict} (${consensusScore}% score)`);

        // Save to database
        const search = await Search.create({
            userId: req.user._id,
            articleText: articleText.substring(0, 5000), // cap stored text
            nodeResults: nodeResults.map((r) => ({
                nodeName: r.nodeName,
                verdict: r.verdict,
                confidence: r.confidence,
                explanation: r.explanation,
            })),
            finalVerdict,
            consensusScore,
        });

        // Return full results to client
        res.json({
            _id: search._id,
            nodeResults,
            finalVerdict,
            consensusScore,
            votingDetails,
            totalTime,
            analyzedAt: search.createdAt,
        });
    } catch (error) {
        console.error("Analysis error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
