import { useEffect, useRef, useState } from "react";

export default function useIdleTimer(timeout = 30000) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    setIsIdle(false);
    timerRef.current = setTimeout(() => setIsIdle(true), timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout]);

  return isIdle;
}
