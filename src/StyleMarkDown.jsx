    import ReactMarkdown from "react-markdown";
    import remarkGfm from "remark-gfm";
    import { Box, Typography } from "@mui/material";
    import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
    import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

    export default function StyledMarkdown({ msg }) {
    const isArabic = /[\u0600-\u06FF]/.test(msg.text);

    return (
        <Box
        sx={{
            "& *": { fontFamily: "'Cairo', sans-serif !important" },
            "& h1, & h2, & h3, & h4": {
            color: "#00BCD4",
            fontWeight: "700",
            marginTop: "1.2rem",
            marginBottom: "0.6rem",
            },
            "& ul, & ol": {
            marginLeft: isArabic ? "0" : "1.2rem",
            paddingLeft: isArabic ? "0" : "1.2rem",
            textAlign: isArabic ? "right" : "left",
            },
            "& li": {
            marginBottom: "4px",
            lineHeight: 1.7,
            listStylePosition: "inside",
            },
            "& blockquote": {
            borderLeft: isArabic
                ? "none"
                : "4px solid rgba(0,188,212,0.6)",
            borderRight: isArabic
                ? "4px solid rgba(0,188,212,0.6)"
                : "none",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontStyle: "italic",
            color: "#E0E0E0",
            },
            "& table": {
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.04)",
            marginY: "1rem",
            },
            "& th, & td": {
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
            textAlign: "center",
            },
            "& th": {
            backgroundColor: "rgba(0,188,212,0.1)",
            color: "#00BCD4",
            fontWeight: "700",
            },
            "& a": {
            color: "#00BCD4",
            textDecoration: "underline",
            transition: "0.3s",
            },
            "& a:hover": {
            color: "#4DD0E1",
            },
            "& pre": {
            backgroundColor: "rgba(15,23,42,0.7)",
            padding: "12px",
            borderRadius: "8px",
            overflowX: "auto",
            },
            "& code": {
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontFamily: "monospace",
            },
            "& input[type='checkbox']": {
            accentColor: "#00BCD4",
            transform: "scale(1.3)",
            marginRight: isArabic ? "0" : "8px",
            marginLeft: isArabic ? "8px" : "0",
            },
        }}
        >
        <ReactMarkdown
            remarkPlugins={[remarkGfm]} // ✅ يضيف دعم للـ emojis والجداول والـ checkbox
            children={msg.text}
            components={{
            p: ({ node, ...props }) => (
                <Typography
                sx={{
                    fontSize: "16px",
                    lineHeight: 1.8,
                    direction: isArabic ? "rtl" : "ltr",
                    textAlign: isArabic ? "right" : "left",
                    marginBottom: "0.8rem",
                }}
                {...props}
                />
            ),
            a: ({ node, ...props }) => (
                <a
                {...props}
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                >
                {props.children}
                </a>
            ),
            code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
                ) : (
                <code {...props}>{children}</code>
                );
            },
            }}
        />
        </Box>
    );
    }
