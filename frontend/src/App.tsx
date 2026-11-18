import { useEffect, useState } from "react";

type ConnectionState = "checking" | "connected" | "unavailable";

function isHealthyResponse(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "ok"
  );
}

function App() {
  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [errorMessage, setErrorMessage] = useState("");

  async function checkBackend(signal?: AbortSignal) {
    setConnection("checking");
    setErrorMessage("");

    try {
      const response = await fetch("/api/health", { signal });
      if (!response.ok) {
        throw new Error(`The API responded with status ${response.status}.`);
      }

      const body: unknown = await response.json();
      if (!isHealthyResponse(body)) {
        throw new Error("The API returned an unexpected health response.");
      }

      setConnection("connected");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setConnection("unavailable");
      setErrorMessage(
        error instanceof Error ? error.message : "The API could not be reached.",
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void checkBackend(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Home Ops Vault home">
          <span className="brand-mark" aria-hidden="true">
            H
          </span>
          <span>Home Ops Vault</span>
        </a>
        <span className="local-badge">
          <span className="badge-dot" aria-hidden="true" />
          Local workspace
        </span>
      </header>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <p className="eyebrow">A calmer way to keep track of home</p>
        <h1 id="welcome-title">Your home knowledge, in one place.</h1>
        <p className="welcome-copy">
          Home Ops Vault is getting its foundations in place. Soon, you&apos;ll
          be able to organize household documents and find answers grounded in
          their contents.
        </p>
        <div className="status-panel" aria-live="polite">
          <div>
            <p className="status-label">Backend connection</p>
            <p className={`status-value status-${connection}`}>
              <span className="status-dot" aria-hidden="true" />
              {connection === "checking" && "Checking connection"}
              {connection === "connected" && "API connected"}
              {connection === "unavailable" && "API unavailable"}
            </p>
            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}
          </div>
          <button
            className="check-button"
            disabled={connection === "checking"}
            onClick={() => void checkBackend()}
            type="button"
          >
            {connection === "checking" ? "Checking..." : "Check again"}
          </button>
        </div>
      </section>

      <section className="next-card" aria-labelledby="next-title">
        <div className="section-icon" aria-hidden="true">
          +
        </div>
        <div>
          <h2 id="next-title">Your document library starts here</h2>
          <p>
            Document upload and search are planned for a later milestone. No
            documents are read or stored by this scaffold.
          </p>
        </div>
        <span className="coming-soon">Coming later</span>
      </section>

      <footer className="page-footer">
        Built for your home. Designed to keep your data close.
      </footer>
    </main>
  );
}

export default App;
