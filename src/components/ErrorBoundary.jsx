import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Lexend, system-ui, sans-serif",
          background: "#d5dbd7",
          padding: 24,
        }}>
          <div style={{
            maxWidth: 380,
            width: "100%",
            background: "rgba(248,250,249,0.92)",
            borderRadius: 18,
            padding: "28px 22px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f1a2b" }}>
              Something went wrong
            </h2>
            <p style={{ margin: "0 0 18px", fontSize: 13, color: "#6b7c8f", lineHeight: 1.5 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: "#1a2638",
                color: "#fff",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
