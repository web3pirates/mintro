const axios = require("axios");

class FearGreedController {
  static async getLatestFearGreedIndex(req, res) {
    try {
      console.log("🔍 Fetching Fear and Greed Index from CoinMarketCap...");
      console.log("📋 API Key present:", !!process.env.CMC_API_KEY);

      // Fetch both latest and historical data for trend calculation
      const response = await axios.get(
        "https://pro-api.coinmarketcap.com/v3/fear-and-greed/historical",
        {
          params: {
            limit: 8, // Get 8 days to calculate 7-day trend
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
          },
        }
      );

      // console.log("✅ CoinMarketCap API Response Status:", response.data);

      if (response.data.status.error_code !== "0") {
        console.error("❌ CoinMarketCap API Error:", response.data.status);
        throw new Error(
          `CoinMarketCap API Error: ${response.data.status.error_message} (Code: ${response.data.status.error_code})`
        );
      }

      const data = response.data.data;
      const latest = data[0];
      console.log("🎯 Latest Fear and Greed Data:", latest);

      // Calculate trend based on last 7 days (excluding today)
      const lastWeekData = data.slice(1, 8); // Days 1-7 (excluding today)
      const lastWeekAverage =
        lastWeekData.reduce((sum, day) => sum + day.value, 0) /
        lastWeekData.length;
      const currentValue = latest.value;

      // Calculate percentage change from 7-day average
      const percentageChange =
        ((currentValue - lastWeekAverage) / lastWeekAverage) * 100;

      // Calculate granular trend: +3 to -3 based on percentage change
      let trend;
      let trendDescription;
      if (percentageChange >= 15) {
        trend = 3;
        trendDescription = "Sentiment is rising strongly";
      } else if (percentageChange >= 8) {
        trend = 2;
        trendDescription = "Sentiment is rising";
      } else if (percentageChange >= 3) {
        trend = 1;
        trendDescription = "Sentiment is rising slightly";
      } else if (percentageChange >= -3) {
        trend = 0;
        trendDescription = "Sentiment is stable";
      } else if (percentageChange >= -8) {
        trend = -1;
        trendDescription = "Sentiment is falling slightly";
      } else if (percentageChange >= -15) {
        trend = -2;
        trendDescription = "Sentiment is falling";
      } else {
        trend = -3;
        trendDescription = "Sentiment is falling strongly";
      }

      console.log("📊 Trend Calculation:");
      console.log("   Current Value:", currentValue);
      console.log("   Last Week Average:", lastWeekAverage.toFixed(2));
      console.log("   Percentage Change:", percentageChange.toFixed(2) + "%");
      console.log("   Trend:", trend);

      res.json({
        timestamp: latest.timestamp,
        value: latest.value,
        classification: latest.value_classification,
        trend: trend, // Calculated trend based on last week's average
        trendDescription: trendDescription, // Human-readable trend description
        label:
          latest.value_classification === "Bearish"
            ? "Bearish"
            : latest.value_classification === "Slightly Bearish"
            ? "Slightly Bearish"
            : latest.value_classification === "Neutral"
            ? "Neutral"
            : latest.value_classification === "Slightly Bullish"
            ? "Slightly Bullish"
            : latest.value_classification === "Bullish"
            ? "Bullish"
            : "Unknown",
        trendDetails: {
          currentValue: currentValue,
          lastWeekAverage: parseFloat(lastWeekAverage.toFixed(2)),
          change: parseFloat((currentValue - lastWeekAverage).toFixed(2)),
          percentageChange: parseFloat(
            (
              ((currentValue - lastWeekAverage) / lastWeekAverage) *
              100
            ).toFixed(2)
          ),
        },
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

      // console.log("✅ CoinMarketCap API Response Status:", response.data);

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
