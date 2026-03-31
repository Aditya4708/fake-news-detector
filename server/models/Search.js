import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        articleText: {
            type: String,
            required: true,
        },
        nodeResults: [
            {
                nodeName: String,
                verdict: String,
                confidence: Number,
                explanation: String,
            },
        ],
        finalVerdict: {
            type: String,
            enum: ["REAL", "FAKE", "UNCERTAIN"],
            required: true,
        },
        consensusScore: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Search = mongoose.model("Search", searchSchema);
export default Search;