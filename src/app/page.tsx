"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleForward = async () => {
    setErrorMsg(null);
    const input = url.trim();
    if (!input) {
      setErrorMsg("Please enter input in format a:b:c");
      return;
    }

    setIsForwarding(true);
    try {
      // First resolve via API to catch and surface errors nicely in the UI
      const res = await fetch(
        `/api/resolve?input=${encodeURIComponent(input)}`
      );
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Failed to resolve input";
        setErrorMsg(message);
        return;
      }
      const targetUrl: string | undefined = data?.url;
      if (!targetUrl) {
        setErrorMsg("Resolver did not return a URL");
        return;
      }
      // Navigate to the resolved URL
      window.location.href = targetUrl;
    } catch {
      setErrorMsg("Network error while resolving input");
    } finally {
      setIsForwarding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleForward();
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Explorer Forwarder</h1>
        <p className={styles.subtitle}>
          Based on{" "}
          <a
            href="https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7950.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            ERC-7950
          </a>
        </p>
        <p className={styles.description}>
          Enter input as a:b:c and click Forward to resolve and redirect
        </p>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter input (e.g., 1:0xabc...:tx)"
            className={styles.urlInput}
            disabled={isForwarding}
          />
          <button
            onClick={handleForward}
            disabled={isForwarding || !url.trim()}
            className={styles.forwardButton}
          >
            {isForwarding ? "Forwarding..." : "Forward"}
          </button>
        </div>

        {errorMsg && (
          <div className={styles.error}>
            <p>{errorMsg}</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Find more info at the project&apos;s{" "}
          <a
            href="https://github.com/microbecode/explorer-forwarder"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub repository
          </a>
        </p>
      </footer>
    </div>
  );
}
