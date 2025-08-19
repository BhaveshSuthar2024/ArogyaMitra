import useIdleTimer from "../hooks/useIdleTimer"; // Adjust path
import "./ScreenSaver.css";
import { useRef } from "react";

export default function ScreenSaver() {
  const isIdle = useIdleTimer(30000); // 30 sec
  const videoRef = useRef(null);

  const handleWakeUp = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="kiosk-container" onMouseMove={handleWakeUp} onKeyDown={handleWakeUp} onTouchStart={handleWakeUp}>
      {isIdle && (
        <div className="screensaver">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            preload="auto"
            className="screensaver-video"
          >
            <source src="/video/screen_saver.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
