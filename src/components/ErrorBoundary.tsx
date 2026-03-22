
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page or try again later.</p>
                    <pre style={{
                        textAlign: "left",
                        backgroundColor: "#f3f4f6",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        overflow: "auto",
                        maxWidth: "800px",
                        margin: "0 auto",
                        color: "#dc2626"
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
