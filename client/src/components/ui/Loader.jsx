import { motion } from "framer-motion";

export default function Loader({ text = "Loading...", fullPage = false }) {
    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <div
                style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid rgba(234,179,8,0.15)",
                    borderTopColor: "#eab308",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />
            <span
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#52525b",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                }}
            >
                {text}
            </span>
        </motion.div>
    );

    if (fullPage) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {content}
            </div>
        );
    }

    return content;
}
