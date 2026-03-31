export default function Input({
    label,
    multiline = false,
    rows = 6,
    error,
    style = {},
    inputStyle = {},
    ...props
}) {
    const baseStyle = {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: error
            ? "1px solid rgba(239,68,68,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        padding: multiline ? "1rem" : "0.75rem 1rem",
        color: "#fafafa",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.85rem",
        outline: "none",
        transition: "all 0.2s",
        resize: multiline ? "vertical" : "none",
        lineHeight: multiline ? "1.7" : "1.5",
        ...inputStyle,
    };

    const Component = multiline ? "textarea" : "input";

    return (
        <div style={{ marginBottom: "1.25rem", ...style }}>
            {label && (
                <label
                    style={{
                        display: "block",
                        fontSize: "0.68rem",
                        color: "#71717a",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {label}
                </label>
            )}
            <Component
                rows={multiline ? rows : undefined}
                style={baseStyle}
                onFocus={(e) => {
                    e.target.style.borderColor = "rgba(234,179,8,0.4)";
                    e.target.style.background = "rgba(234,179,8,0.03)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(234,179,8,0.08)";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error
                        ? "rgba(239,68,68,0.4)"
                        : "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.04)";
                    e.target.style.boxShadow = "none";
                }}
                {...props}
            />
            {error && (
                <p
                    style={{
                        color: "#ef4444",
                        fontSize: "0.72rem",
                        marginTop: "0.4rem",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
