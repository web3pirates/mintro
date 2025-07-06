const axios = require("axios");

class TragicNewsController {
  static async getTragicNews(req, res) {
    try {
      console.log("🔍 Fetching tragic news that could impact markets...");
      console.log("📋 News API Key present:", !!process.env.NEWS_API_KEY);

      // Keywords that typically indicate tragic or negative news that could impact markets
      const tragicKeywords = [
        "terrorist attack",
        "mass shooting",
        "natural disaster",
        "earthquake",
        "hurricane",
        "tsunami",
        "war",
        "conflict",
        "bombing",
        "assassination",
        "pandemic",
        "outbreak",
        "economic crisis",
        "recession",
        "market crash",
        "bankruptcy",
        "default",
        "sanctions",
        "trade war",
        "cyber attack",
        "hack",
        "data breach",
        "oil spill",
        "nuclear",
        "radiation",
        "epidemic",
      ];

      // Get date range from query parameters or use defaults
      const { from, to, days } = req.query;

      let fromDate, toDate;

      if (from && to) {
        // Use custom date range
        fromDate = new Date(from);
        toDate = new Date(to);
      } else if (days) {
        // Use number of days back from today
        const daysBack = parseInt(days) || 1;
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - daysBack);
      } else {
        // Default: last 24 hours
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 1);
      }

      // Validate dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD format.",
        });
      }

      // Ensure fromDate is before toDate
      if (fromDate > toDate) {
        return res.status(400).json({
          error: "From date must be before to date",
        });
      }

      console.log(
        `📅 Searching news from ${fromDate.toISOString().split("T")[0]} to ${
          toDate.toISOString().split("T")[0]
        }`
      );

      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: tragicKeywords.join(" OR "),
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
          language: "en",
          sortBy: "relevancy",
          pageSize: 20,
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      if (response.data.status !== "ok") {
        console.error("❌ News API Error:", response.data);
        throw new Error(
          `News API Error: ${response.data.message || "Unknown error"}`
        );
      }

      const articles = response.data.articles || [];
      console.log(`📰 Found ${articles.length} potential tragic news articles`);

      // Analyze and filter articles for market impact potential
      const marketImpactNews = articles
        .filter((article) => {
          // Filter out articles that are likely not market-relevant
          const title = (article.title || "").toLowerCase();
          const description = (article.description || "").toLowerCase();
          const content = (article.content || "").toLowerCase();

          // Skip articles that are too old or not relevant
          if (!article.publishedAt) return false;

          // Check if article contains market-relevant keywords
          const marketKeywords = [
            "market",
            "stock",
            "trading",
            "economy",
            "financial",
            "investment",
            "oil",
            "gold",
            "currency",
            "dollar",
            "euro",
            "bitcoin",
            "crypto",
            "fed",
            "central bank",
            "interest rate",
            "inflation",
            "unemployment",
            "gdp",
            "trade",
            "tariff",
            "sanction",
            "bank",
            "banking",
          ];

          const hasMarketRelevance = marketKeywords.some(
            (keyword) =>
              title.includes(keyword) ||
              description.includes(keyword) ||
              content.includes(keyword)
          );

          return hasMarketRelevance;
        })
        .map((article) => {
          // Calculate impact score based on various factors
          let impactScore = 0;
          const title = (article.title || "").toLowerCase();
          const description = (article.description || "").toLowerCase();

          // High impact keywords
          const highImpactKeywords = [
            "war",
            "nuclear",
            "terrorist",
            "pandemic",
            "crisis",
            "crash",
          ];
          const mediumImpactKeywords = [
            "attack",
            "disaster",
            "conflict",
            "sanction",
            "default",
          ];
          const lowImpactKeywords = ["breach", "hack", "spill", "outbreak"];

          highImpactKeywords.forEach((keyword) => {
            if (title.includes(keyword) || description.includes(keyword)) {
              impactScore += 3;
            }
          });

          mediumImpactKeywords.forEach((keyword) => {
            if (title.includes(keyword) || description.includes(keyword)) {
              impactScore += 2;
            }
          });

          lowImpactKeywords.forEach((keyword) => {
            if (title.includes(keyword) || description.includes(keyword)) {
              impactScore += 1;
            }
          });

          // Boost score for major news sources
          const majorSources = [
            "reuters",
            "bloomberg",
            "cnn",
            "bbc",
            "wall street journal",
            "financial times",
          ];
          if (
            majorSources.some((source) =>
              (article.source?.name || "").toLowerCase().includes(source)
            )
          ) {
            impactScore += 1;
          }

          // Determine impact level
          let impactLevel;
          if (impactScore >= 5) {
            impactLevel = "HIGH";
          } else if (impactScore >= 3) {
            impactLevel = "MEDIUM";
          } else {
            impactLevel = "LOW";
          }

          return {
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name,
            impactScore: impactScore,
            impactLevel: impactLevel,
            relevance: "Market-relevant tragic news",
          };
        })
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 10); // Return top 10 most impactful

      console.log(
        `🎯 Found ${marketImpactNews.length} market-impacting tragic news articles`
      );

      // Calculate overall market sentiment impact
      const totalImpactScore = marketImpactNews.reduce(
        (sum, article) => sum + article.impactScore,
        0
      );
      const averageImpactScore =
        marketImpactNews.length > 0
          ? totalImpactScore / marketImpactNews.length
          : 0;

      let overallSentiment;
      if (averageImpactScore >= 4) {
        overallSentiment = "VERY_NEGATIVE";
      } else if (averageImpactScore >= 2.5) {
        overallSentiment = "NEGATIVE";
      } else if (averageImpactScore >= 1) {
        overallSentiment = "SLIGHTLY_NEGATIVE";
      } else {
        overallSentiment = "NEUTRAL";
      }

      res.json({
        timestamp: new Date().toISOString(),
        dateRange: {
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
        },
        totalArticles: marketImpactNews.length,
        averageImpactScore: parseFloat(averageImpactScore.toFixed(2)),
        overallSentiment: overallSentiment,
        articles: marketImpactNews,
        summary: {
          highImpactCount: marketImpactNews.filter(
            (a) => a.impactLevel === "HIGH"
          ).length,
          mediumImpactCount: marketImpactNews.filter(
            (a) => a.impactLevel === "MEDIUM"
          ).length,
          lowImpactCount: marketImpactNews.filter(
            (a) => a.impactLevel === "LOW"
          ).length,
        },
      });
    } catch (error) {
      console.error("💥 Tragic News API Error Details:");
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
        error: "Failed to fetch tragic news data",
        message: error.message,
        details: error.response?.data || "No additional details available",
        status: error.response?.status || "Unknown",
      });
    }
  }

  static async getNewsByKeyword(req, res) {
    try {
      const { keyword } = req.params;
      const { from, to, days } = req.query;

      if (!keyword) {
        return res.status(400).json({
          error: "Keyword parameter is required",
        });
      }

      console.log(`🔍 Fetching news for keyword: ${keyword}`);
      console.log("📋 News API Key present:", !!process.env.NEWS_API_KEY);

      // Get date range from query parameters or use defaults
      let fromDate, toDate;

      if (from && to) {
        // Use custom date range
        fromDate = new Date(from);
        toDate = new Date(to);
      } else if (days) {
        // Use number of days back from today
        const daysBack = parseInt(days) || 1;
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - daysBack);
      } else {
        // Default: last 24 hours
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 1);
      }

      // Validate dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD format.",
        });
      }

      // Ensure fromDate is before toDate
      if (fromDate > toDate) {
        return res.status(400).json({
          error: "From date must be before to date",
        });
      }

      console.log(
        `📅 Searching news from ${fromDate.toISOString().split("T")[0]} to ${
          toDate.toISOString().split("T")[0]
        }`
      );

      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: keyword,
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
          language: "en",
          sortBy: "relevancy",
          pageSize: 15,
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      if (response.data.status !== "ok") {
        console.error("❌ News API Error:", response.data);
        throw new Error(
          `News API Error: ${response.data.message || "Unknown error"}`
        );
      }

      const articles = response.data.articles || [];
      console.log(
        `📰 Found ${articles.length} articles for keyword: ${keyword}`
      );

      const processedArticles = articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source?.name,
        keyword: keyword,
      }));

      res.json({
        keyword: keyword,
        timestamp: new Date().toISOString(),
        dateRange: {
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
        },
        totalArticles: processedArticles.length,
        articles: processedArticles,
      });
    } catch (error) {
      console.error("💥 News API Error Details:");
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
        error: "Failed to fetch news data",
        message: error.message,
        details: error.response?.data || "No additional details available",
        status: error.response?.status || "Unknown",
      });
    }
  }
}

module.exports = TragicNewsController;
