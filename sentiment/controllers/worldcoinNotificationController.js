const axios = require("axios");

class WorldcoinNotificationController {
  static async sendNotification(req, res) {
    try {
      const { app_id, wallet_addresses, title, message, mini_app_path } =
        req.body;

      // Validate required fields
      if (!app_id || !wallet_addresses || !title || !message) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "app_id, wallet_addresses, title, and message are required",
        });
      }

      // Validate wallet_addresses is an array
      if (!Array.isArray(wallet_addresses) || wallet_addresses.length === 0) {
        return res.status(400).json({
          error: "Invalid wallet_addresses",
          message: "wallet_addresses must be a non-empty array",
        });
      }

      const notificationData = {
        app_id,
        wallet_addresses,
        title,
        message,
        mini_app_path: mini_app_path || `worldapp://mini-app?app_id=${app_id}`,
      };

      console.log("📤 Notification payload:", notificationData);

      // Always use Bearer prefix as shown in the original curl command
      const authHeader = `Bearer ${process.env.WORLDCOIN_API_KEY}`;
      console.log("🔑 Final auth header:", authHeader.substring(0, 30) + "...");

      const response = await axios.post(
        "https://developer.worldcoin.org/api/v2/minikit/send-notification",
        notificationData,
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Worldcoin notification sent successfully");
      console.log("📊 Response:", response.data);

      res.json({
        success: true,
        message: "Notification sent successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("💥 Worldcoin Notification API Error Details:");
      console.error("   Error Type:", error.constructor.name);
      console.error("   Error Message:", error.message);
      console.error("   Error Stack:", error.stack);

      if (error.response) {
        console.error("   Response Status:", error.response.status);
        console.error(
          "   Response Data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("   Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("   Request Error - No response received");
        console.error("   Request Details:", error.request);
      } else {
        console.error("   Other Error:", error.message);
      }

      res.status(500).json({
        error: "Failed to send Worldcoin notification",
        message: error.message,
        details: error.response?.data || "No additional details available",
        status: error.response?.status || "Unknown",
      });
    }
  }
}

module.exports = WorldcoinNotificationController;
