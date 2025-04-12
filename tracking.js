const db = require("./db"); // your existing db.js

async function insertTrackingData({
  ipAddress,
  screenResolution,
  userAgent,
  timestamp,
}) {
  const sql = `
    INSERT INTO tracking (ip_address, screen_resolution, user_agent, timestamp)
    VALUES (?, ?, ?, ?)
  `;
  const values = [ipAddress, screenResolution, userAgent, timestamp];

  try {
    const [result] = await db.execute(sql, values);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting tracking data:", error);
    throw error;
  }
}

module.exports = { insertTrackingData };
