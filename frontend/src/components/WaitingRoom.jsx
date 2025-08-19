import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function WaitingRoom() {
  const { search } = useLocation();
  const [roomUrl, setRoomUrl] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(search);
    const url = query.get("roomUrl");
    if (url) {
      setRoomUrl(decodeURIComponent(url));
    }
  }, [search]);

  if (!roomUrl) return <p>Loading video call...</p>;

  return (
    <div style={{ height: "100vh", padding: "0", margin: "0" }}>
      <iframe
        src={roomUrl} // 👈 fixed this
        allow="camera; microphone; fullscreen"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Doctor Consultation Room"
      />
    </div>
  );
}