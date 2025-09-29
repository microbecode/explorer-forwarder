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
      // Navigate to the API with redirect=1 to let the server issue the redirect
      window.location.href = `/api/resolve?input=${encodeURIComponent(input)}&redirect=1`;
      return;
    } catch (error) {
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
          Based on <a href="https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7950.md" target="_blank" rel="noopener noreferrer">ERC-7950</a>
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
          <div className={styles.info}>
            <p>{errorMsg}</p>
          </div>
        )}
      </main>
    </div>
  );
}