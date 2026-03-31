import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp, Clock, Search } from "lucide-react";
import api from "../utils/api";
import Modal from "../components/ui/Modal";

const VERDICT_COLORS = {
    REAL: "#22c55e",
    FAKE: "#ef4444",
    UNCERTAIN: "#eab308",
};

function HistoryCard({ search, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    const verdictColor = VERDICT_COLORS[search.finalVerdict] || VERDICT_COLORS.UNCERTAIN;
    const date = new Date(search.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
        >
            {/* Header */}
            <div
                style={{
                    padding: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                }}
                onClick={() => setExpanded(!expanded)}
            >
                {/* Verdict badge */}
                <div
                    style={{
                        flexShrink: 0,
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.62rem",
                        letterSpacing: "1.5px",
                        color: verdictColor,
                        background: `${verdictColor}12`,
                        border: `1px solid ${verdictColor}30`,
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        marginTop: "0.1rem",
                    }}
                >
                    {search.finalVerdict}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.78rem",
                            color: "#d4d4d8",
                            lineHeight: 1.6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {search.articleText}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "0.5rem",
                            fontSize: "0.62rem",
                            color: "#52525b",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={10} /> {date}
                        </span>
                        <span>
                            Score: {search.consensusScore}%
                        </span>
                    </div>
                </div>

                {/* Expand/Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(search._id); }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#3f3f46",
                            cursor: "pointer",
                            padding: "0.3rem",
                            borderRadius: "4px",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.target.style.color = "#3f3f46")}
                    >
                        <Trash2 size={14} />
                    </button>
                    {expanded ? <ChevronUp size={14} color="#52525b" /> : <ChevronDown size={14} color="#52525b" />}
                </div>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div
                            style={{
                                padding: "0 1.25rem 1.25rem",
                                borderTop: "1px solid rgba(255,255,255,0.04)",
                                paddingTop: "1rem",
                            }}
                        >
                            {/* Node results */}
                            <div
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.6rem",
                                    color: "#52525b",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                Node Results
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                                {search.nodeResults?.map((node, i) => {
                                    const nc = VERDICT_COLORS[node.verdict] || "#eab308";
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                background: "rgba(255,255,255,0.02)",
                                                border: "1px solid rgba(255,255,255,0.04)",
                                                borderRadius: "8px",
                                                padding: "0.75rem",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.68rem", color: "#d4d4d8" }}>
                                                    {node.nodeName}
                                                </span>
                                                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.6rem", color: nc, letterSpacing: "1px" }}>
                                                    {node.verdict}
                                                </span>
                                            </div>
                                            <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.04)", borderRadius: "2px", marginBottom: "0.4rem" }}>
                                                <div style={{ height: "100%", width: `${node.confidence}%`, background: nc, borderRadius: "2px" }} />
                                            </div>
                                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#71717a", lineHeight: 1.5 }}>
                                                {node.explanation}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function History() {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const fetchHistory = async (p = 1) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/history?page=${p}&limit=15`);
            setSearches(data.searches);
            setPagination(data.pagination);
            setPage(p);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/history/${id}`);
            setSearches((prev) => prev.filter((s) => s._id !== id));
            setDeleteId(null);
        } catch (err) {
            setError("Failed to delete.");
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .history-page {
          min-height: 100vh;
          background: #080808;
          padding: 6rem 2rem 4rem;
          font-family: 'Inter', sans-serif;
        }
        .history-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .history-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          color: #fafafa;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
        }
        .history-subtitle {
          color: #52525b;
          font-size: 0.78rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #3f3f46;
        }
        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }
        .pagination-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .page-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #a1a1aa;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          border-color: rgba(234,179,8,0.3);
          color: #eab308;
        }
        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .history-page { padding: 5rem 1rem 3rem; }
        }
      `}</style>

            <div className="history-page">
                <div className="history-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="history-title">Analysis History</h1>
                        <p className="history-subtitle">
                            Your past analyses and their distributed consensus results.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "4rem", color: "#52525b" }}>
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    border: "3px solid rgba(234,179,8,0.15)",
                                    borderTopColor: "#eab308",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                    margin: "0 auto 1rem",
                                }}
                            />
                            Loading history...
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: "center", padding: "4rem", color: "#ef4444", fontSize: "0.8rem" }}>
                            {error}
                        </div>
                    ) : searches.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><Search size={40} /></div>
                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#52525b", marginBottom: "0.5rem" }}>
                                No analyses yet
                            </p>
                            <p style={{ fontSize: "0.72rem", color: "#3f3f46" }}>
                                Go to the detector and analyze your first article!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="history-list">
                                <AnimatePresence>
                                    {searches.map((search) => (
                                        <HistoryCard
                                            key={search._id}
                                            search={search}
                                            onDelete={(id) => setDeleteId(id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {pagination && pagination.pages > 1 && (
                                <div className="pagination-row">
                                    <button
                                        className="page-btn"
                                        disabled={page <= 1}
                                        onClick={() => fetchHistory(page - 1)}
                                    >
                                        ← Previous
                                    </button>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#52525b" }}>
                                        Page {page} of {pagination.pages}
                                    </span>
                                    <button
                                        className="page-btn"
                                        disabled={page >= pagination.pages}
                                        onClick={() => fetchHistory(page + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Analysis"
                onConfirm={() => handleDelete(deleteId)}
                confirmText="Delete"
            >
                Are you sure you want to delete this analysis? This action cannot be undone.
            </Modal>
        </>
    );
}
