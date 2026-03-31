import { useState } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw, History, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import NetworkVisualizer from "../components/detector/NetworkVisualizer";
import NodeCard from "../components/detector/NodeCard";
import VotingBreakdown from "../components/detector/VotingBreakdown";
import FinalVerdict from "../components/detector/FinalVerdict";

const SAMPLE_ARTICLES = [
    {
        label: "Suspicious Article",
        text: `BREAKING: Scientists in Geneva have discovered that 5G towers are emitting a new form of radiation that has been linked to a 300% increase in headaches across Europe. The study, conducted by an unnamed research group, claims that governments worldwide are covering up the findings. "They don't want you to know the truth," said an anonymous source close to the investigation. Major telecom companies have refused to comment, which experts say is proof of a massive conspiracy. Share this before it gets deleted!`,
    },
    {
        label: "Legitimate Article",
        text: `The World Health Organization released its annual Global Health Report on Tuesday, highlighting a 12% decrease in malaria-related deaths across Sub-Saharan Africa over the past five years. According to WHO Director-General Dr. Tedros Adhanom Ghebreyesus, the decline is attributed to increased distribution of insecticide-treated bed nets and improved access to antimalarial medications. The report, based on data from 47 member states, also noted challenges in rural healthcare access. The findings were peer-reviewed and published in The Lancet.`,
    },
];

export default function Detector() {
    const [articleText, setArticleText] = useState("");
    const [phase, setPhase] = useState("input"); // input | analyzing | results
    const [nodeStatuses, setNodeStatuses] = useState(["waiting", "waiting", "waiting", "waiting"]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [urlError, setUrlError] = useState("");
    const [urlLoading, setUrlLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleAnalyze = async () => {
        if (!articleText.trim() || articleText.trim().length < 20) {
            setError("Please enter at least 20 characters of article text.");
            return;
        }

        setError("");
        setPhase("analyzing");
        setResults(null);

        // Animate nodes sequentially for visual effect
        const statusUpdates = [
            ["analyzing", "waiting", "waiting", "waiting"],
            ["analyzing", "analyzing", "waiting", "waiting"],
            ["analyzing", "analyzing", "analyzing", "waiting"],
            ["analyzing", "analyzing", "analyzing", "analyzing"],
        ];

        statusUpdates.forEach((statuses, i) => {
            setTimeout(() => setNodeStatuses(statuses), i * 400);
        });

        try {
            const { data } = await api.post("/analyze", { articleText: articleText.trim() });

            // Animate nodes to "done" sequentially
            const doneUpdates = [
                ["done", "analyzing", "analyzing", "analyzing"],
                ["done", "done", "analyzing", "analyzing"],
                ["done", "done", "done", "analyzing"],
                ["done", "done", "done", "done"],
            ];

            doneUpdates.forEach((statuses, i) => {
                setTimeout(() => setNodeStatuses(statuses), i * 200);
            });

            setTimeout(() => {
                setResults(data);
                setPhase("results");
            }, 900);
        } catch (err) {
            setNodeStatuses(["error", "error", "error", "error"]);
            setError(err.response?.data?.message || "Analysis failed. Please try again.");
            setTimeout(() => setPhase("input"), 2000);
        }
    };

    const handleUrlFetch = async () => {
        if (!urlInput.trim()) {
            setUrlError("Please enter a URL.");
            return;
        }

        try {
            setUrlError("");
            setUrlLoading(true);
            const encoded = encodeURIComponent(urlInput.trim());
            const { data } = await api.get(`/extract?url=${encoded}`);
            setArticleText(data.text);
            setFileName("");
        } catch (err) {
            setUrlError(err.response?.data?.message || "Could not fetch URL content.");
        } finally {
            setUrlLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes("text")) {
            setError("Only text files are supported (txt, md). Please try a different file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
            if (typeof text === "string") {
                setArticleText(text);
                setFileName(file.name);
                setError("");
            }
        };
        reader.onerror = () => {
            setError("Failed to read file. Please try again.");
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        setPhase("input");
        setArticleText("");
        setResults(null);
        setError("");
        setNodeStatuses(["waiting", "waiting", "waiting", "waiting"]);
        setUrlInput("");
        setUrlError("");
        setUrlLoading(false);
        setFileName("");
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .detector-page {
          min-height: 100vh;
          background: #080808;
          padding: 6rem 2rem 4rem;
          font-family: 'Inter', sans-serif;
        }
        .detector-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .detector-header {
          margin-bottom: 2rem;
        }
        .detector-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          color: #fafafa;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
        }
        .detector-subtitle {
          color: #52525b;
          font-size: 0.78rem;
          line-height: 1.6;
        }
        .detector-textarea {
          width: 100%;
          min-height: 180px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.25rem;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          line-height: 1.8;
          resize: vertical;
          outline: none;
          transition: all 0.2s;
        }
        .detector-textarea:focus {
          border-color: rgba(234,179,8,0.3);
          background: rgba(234,179,8,0.02);
          box-shadow: 0 0 0 3px rgba(234,179,8,0.06);
        }
        .detector-textarea::placeholder {
          color: #3f3f46;
        }
        .char-count {
          text-align: right;
          font-size: 0.62rem;
          color: #3f3f46;
          margin-top: 0.3rem;
          letter-spacing: 0.5px;
        }
        .actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .sample-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .sample-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #71717a;
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .sample-btn:hover {
          border-color: rgba(234,179,8,0.3);
          color: #eab308;
        }
        .analyze-btn {
          background: #eab308;
          color: #0a0a0a;
          border: none;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .analyze-btn:hover:not(:disabled) {
          background: #ca8a04;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(234,179,8,0.25);
        }
        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error-msg {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 1rem;
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .results-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .reset-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #a1a1aa;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          color: #fafafa;
          border-color: rgba(255,255,255,0.2);
        }
        .history-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #eab308;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          text-decoration: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          border: 1px solid rgba(234,179,8,0.2);
          transition: all 0.2s;
        }
        .history-link:hover {
          background: rgba(234,179,8,0.08);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @media (max-width: 600px) {
          .results-grid { grid-template-columns: 1fr; }
          .actions-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

            <div className="detector-page">
                <div className="detector-container">
                    {/* Header */}
                    <motion.div
                        className="detector-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="detector-title">Analyze Article</h1>
                        <p className="detector-subtitle">
                            Paste a news article or headline below. 4 AI nodes will analyze it in parallel and vote on authenticity.
                        </p>
                    </motion.div>

                    {/* INPUT PHASE */}
                    {phase === "input" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <textarea
                                className="detector-textarea"
                                placeholder="Paste your article text here..."
                                value={articleText}
                                onChange={(e) => {
                                    setArticleText(e.target.value);
                                    setError("");
                                }}
                                maxLength={20000}
                            />
                            <div className="char-count">
                                {articleText.length} / 20,000
                            </div>

                            {error && <div className="error-msg">⚠ {error}</div>}

                            <div className="actions-row">
                                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", width: "100%" }}>
                                    <input
                                        type="url"
                                        placeholder="Enter article URL to fetch text"
                                        value={urlInput}
                                        onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                                        style={{
                                            flex: 1,
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "8px",
                                            color: "#fafafa",
                                            padding: "0.65rem 0.8rem",
                                            fontSize: "0.8rem",
                                        }}
                                    />
                                    <button
                                        className="analyze-btn"
                                        type="button"
                                        onClick={handleUrlFetch}
                                        disabled={urlLoading || !urlInput.trim()}
                                        style={{ minWidth: "130px" }}
                                    >
                                        {urlLoading ? "Fetching..." : "Load URL"}
                                    </button>
                                </div>
                            </div>
                            {urlError && <div className="error-msg">⚠ {urlError}</div>}

                            <div className="actions-row" style={{ marginTop: "0.75rem" }}>
                                <label
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.45rem",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        padding: "0.45rem 0.75rem",
                                        cursor: "pointer",
                                        color: "#fafafa",
                                        fontSize: "0.78rem",
                                    }}
                                >
                                    Upload file
                                    <input
                                        type="file"
                                        accept=".txt,.md,text/plain"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                </label>
                                {fileName && <span style={{ color: "#a3a3a3", fontSize: "0.76rem" }}>loaded: {fileName}</span>}
                            </div>

                            <div className="actions-row">
                                <div className="sample-btns">
                                    {SAMPLE_ARTICLES.map((sample) => (
                                        <button
                                            key={sample.label}
                                            className="sample-btn"
                                            onClick={() => setArticleText(sample.text)}
                                        >
                                            <FileText size={11} style={{ marginRight: "0.3rem" }} />
                                            {sample.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="analyze-btn"
                                    onClick={handleAnalyze}
                                    disabled={!articleText.trim()}
                                >
                                    <Send size={15} />
                                    Analyze
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYZING PHASE */}
                    {phase === "analyzing" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "12px",
                                    padding: "1rem 1.25rem",
                                    marginBottom: "1rem",
                                    maxHeight: "80px",
                                    overflow: "hidden",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#52525b",
                                        fontSize: "0.72rem",
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    {articleText.substring(0, 200)}...
                                </p>
                            </div>

                            <NetworkVisualizer
                                nodeStatuses={nodeStatuses}
                                phase="analyzing"
                            />

                            {error && <div className="error-msg">⚠ {error}</div>}
                        </motion.div>
                    )}

                    {/* RESULTS PHASE */}
                    {phase === "results" && results && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {/* Network viz in done state */}
                            <NetworkVisualizer
                                nodeStatuses={["done", "done", "done", "done"]}
                                phase="done"
                            />

                            {/* Final Verdict */}
                            <div style={{ marginBottom: "2rem" }}>
                                <FinalVerdict
                                    verdict={results.finalVerdict}
                                    consensusScore={results.consensusScore}
                                    totalTime={results.totalTime}
                                />
                            </div>

                            {/* Node Results Grid */}
                            <div
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.65rem",
                                    color: "#52525b",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    marginBottom: "1rem",
                                }}
                            >
                                Individual Node Results
                            </div>
                            <div className="results-grid">
                                {results.nodeResults.map((result, i) => (
                                    <NodeCard key={i} result={result} index={i} />
                                ))}
                            </div>

                            {/* Voting Breakdown */}
                            <VotingBreakdown
                                votingDetails={results.votingDetails}
                                nodeResults={results.nodeResults}
                            />

                            {/* Actions */}
                            <div className="results-actions">
                                <button className="reset-btn" onClick={handleReset}>
                                    <RotateCcw size={14} />
                                    New Analysis
                                </button>
                                <Link to="/history" className="history-link">
                                    <History size={14} />
                                    View History
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
