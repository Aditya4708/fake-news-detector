import express from "express";
import protect from "../middleware/authMiddleware.js";
import Search from "../models/Search.js";

const router = express.Router();

// @route   GET /api/history
// @desc    Get user's analysis history (newest first)
// @access  Protected
router.get("/", protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [searches, total] = await Promise.all([
            Search.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v"),
            Search.countDocuments({ userId: req.user._id }),
        ]);

        res.json({
            searches,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("History fetch error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/history/:id
// @desc    Get single analysis detail
// @access  Protected
router.get("/:id", protect, async (req, res) => {
    try {
        const search = await Search.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!search) {
            return res.status(404).json({ message: "Analysis not found." });
        }

        res.json(search);
    } catch (error) {
        console.error("History detail error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/history/:id
// @desc    Delete a search from history
// @access  Protected
router.delete("/:id", protect, async (req, res) => {
    try {
        const search = await Search.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!search) {
            return res.status(404).json({ message: "Analysis not found." });
        }

        res.json({ message: "Analysis deleted." });
    } catch (error) {
        console.error("History delete error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
