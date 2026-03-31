import { motion } from "framer-motion";

const variants = {
    primary: {
        background: "#eab308",
        color: "#0a0a0a",
        border: "none",
    },
    secondary: {
        background: "transparent",
        color: "#a1a1aa",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    danger: {
        background: "rgba(239,68,68,0.1)",
        color: "#ef4444",
        border: "1px solid rgba(239,68,68,0.2)",
    },
    ghost: {
        background: "transparent",
        color: "#71717a",
        border: "1px solid transparent",
    },
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onClick,
    type = "button",
    style = {},
    ...props
}) {
    const v = variants[variant] || variants.primary;
    const sizes = {
        sm: { padding: "0.5rem 1rem", fontSize: "0.75rem" },
        md: { padding: "0.75rem 1.5rem", fontSize: "0.85rem" },
        lg: { padding: "0.9rem 2rem", fontSize: "0.95rem" },
    };
    const s = sizes[size] || sizes.md;

    return (
        <motion.button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            style={{
                ...v,
                ...s,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                borderRadius: "8px",
                cursor: disabled || loading ? "not-allowed" : "pointer",
                opacity: disabled || loading ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                letterSpacing: "0.3px",
                transition: "all 0.2s",
                ...style,
            }}
            {...props}
        >
            {loading && (
                <span
                    style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                    }}
                />
            )}
            {children}
        </motion.button>
    );
}
