import { useState, useEffect } from "react";

export default function LimitedLink() {
  const maxClicks = 3;
  const resetTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const localStorageKey = "limitedLinkData";

  const [clickCount, setClickCount] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(localStorageKey));
    if (stored) {
      const { count, timestamp } = stored;
      const now = Date.now();

      if (now - timestamp >= resetTime) {
        // Reset after 2 hours
        localStorage.removeItem(localStorageKey);
        setClickCount(0);
      } else {
        setClickCount(count);
      }
    }
  }, []);

  const handleClick = (e) => {
    const now = Date.now();
    let newCount = clickCount + 1;

    if (clickCount >= maxClicks) {
      e.preventDefault(); // stop the link
      alert("You have reached the maximum number of clicks. Try again later!");
      return;
    }

    // Save updated count and timestamp if first click
    const stored = JSON.parse(localStorage.getItem(localStorageKey));
    if (!stored) {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ count: newCount, timestamp: now })
      );
    } else {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ count: newCount, timestamp: stored.timestamp })
      );
    }

    setClickCount(newCount);
  };

  return (
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=zhirr.dev@gmail.com&subject=Hello&body=Hi%20there!"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      Click here to send an email
    </a>
  );
}
