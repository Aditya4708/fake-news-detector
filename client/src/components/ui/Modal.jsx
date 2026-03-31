import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirm", confirmVariant = "danger" }) {
    const confirmColors = {
        danger: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
        primary: { bg: "#eab308", color: "#0a0a0a", border: "none" },
    };
    const cc = confirmColors[confirmVariant] || confirmColors.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#141414",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            maxWidth: "400px",
                            width: "100%",
                        }}
                    >
                        {title && (
                            <h3
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    color: "#fafafa",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {title}
                            </h3>
                        )}
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.8rem",
                                color: "#71717a",
                                lineHeight: 1.6,
                                marginBottom: "1.5rem",
                            }}
                        >
                            {children}
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#a1a1aa",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.78rem",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={() => { onConfirm(); onClose(); }}
                                    style={{
                                        background: cc.bg,
                                        border: cc.border,
                                        color: cc.color,
                                        padding: "0.5rem 1rem",
                                        borderRadius: "6px",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.78rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
