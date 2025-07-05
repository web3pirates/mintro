const axios = require("axios");

class FearGreedController {
  static async getLatestFearGreedIndex(req, res) {
    try {
      console.log("🔍 Fetching Fear and Greed Index from CoinMarketCap...");
      console.log("📋 API Key present:", !!process.env.CMC_API_KEY);

      const response = await axios.get(
        "https://pro-api.coinmarketcap.com/v3/fear-and-greed/historical",
        {
          params: {
            limit: 1,
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
          },
        }
      );

      console.log("✅ CoinMarketCap API Response Status:", response.data);

      if (response.data.status.error_code !== "0") {
        console.error("❌ CoinMarketCap API Error:", response.data.status);
        throw new Error(
          `CoinMarketCap API Error: ${response.data.status.error_message} (Code: ${response.data.status.error_code})`
        );
      }

      const latest = response.data.data[0];
      console.log("🎯 Latest Fear and Greed Data:", latest);

      res.json({
        timestamp: latest.timestamp,
        value: latest.value,
        classification: latest.value_classification,
      });
    } catch (error) {
      console.error("💥 Fear and Greed Index API Error Details:");
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
        error: "Failed to fetch Fear and Greed Index data",
        message: error.message,
        details: error.response?.data || "No additional details available",
        status: error.response?.status || "Unknown",
      });
    }
  }

  static async getHistoricalFearGreedIndex(req, res) {
    try {
      console.log("🔍 Fetching Fear and Greed Index from CoinMarketCap...");
      console.log("📋 API Key present:", !!process.env.CMC_API_KEY);

      const response = await axios.get(
        "https://pro-api.coinmarketcap.com/v3/fear-and-greed/historical",
        {
          params: {
            limit: 100,
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
          },
        }
      );

      console.log("✅ CoinMarketCap API Response Status:", response.data);

      if (response.data.status.error_code !== "0") {
        console.error("❌ CoinMarketCap API Error:", response.data.status);
        throw new Error(
          `CoinMarketCap API Error: ${response.data.status.error_message} (Code: ${response.data.status.error_code})`
        );
      }

      const historical = response.data.data;
      console.log("🎯 Historical Fear and Greed Data:", historical);

      res.json(historical);
    } catch (error) {
      console.error("💥 Fear and Greed Index API Error Details:");
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
        error: "Failed to fetch Fear and Greed Index data",
        message: error.message,
        details: error.response?.data || "No additional details available",
        status: error.response?.status || "Unknown",
      });
    }
  }
}

module.exports = FearGreedController;
