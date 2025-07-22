import axios from "axios";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const HMS_API_BASE = "https://api.100ms.live/v2";
const HMS_ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const HMS_SECRET = process.env.HMS_SECRET;

// Generate Management Token (not room token)
const generateManagementToken = () => {
  return jwt.sign(
    {
      access_key: HMS_ACCESS_KEY,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      jti: uuidv4(), // ✅ REQUIRED: unique token ID
    },
    HMS_SECRET
  );
};

const generateAppToken = ({ roomId, userId, role }) => {
  return jwt.sign(
    {
      access_key: HMS_ACCESS_KEY,
      room_id: roomId,
      user_id: userId,
      role,
      type: "app", // ✅ critical
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      jti: uuidv4(),
    },
    HMS_SECRET
  );
};



// Create Room
export const createRoom = async () => {
  const token = generateManagementToken();

  try {
    const response = await axios.post(
      `${HMS_API_BASE}/rooms`,
      {
        name: `room_${Date.now()}`,
        template_id: process.env.HMS_TEMPLATE_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Room created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error.response?.data || error.message);
    throw new Error("Room creation failed");
  }
};

// Generate Room Token
export const generateRoomToken = async ({ roomId, userId, role }) => {
  const token = generateAppToken({ roomId, userId, role }); // ✅ USE `type: "app"`

  console.log("Token :- ",token);
  

  try {
    const response = await axios.post(
      "https://api.100ms.live/v2/room-tokens",
      {
        room_id: roomId,
        user_id: userId,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("❌ Failed to generate room token:", error.response?.data || error.message);
    throw new Error("Room token generation failed");
  }
};
