import express from "express";
import City from "../models/City.js";
import Activity from "../models/Activity.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q, "i"); 

    const city = await City.findOne({ name: regex }).lean();
    if (city) {
      const activities = await Activity.find({ cityId: city._id }).lean();
      return res.json({
        type: "city",
        city,
        activities
      });
    }

    // If no city found, check for activity search
    const activities = await Activity.find({ name: regex })
      .populate("cityId")
      .lean();

    if (activities.length > 0) {
      const cities = [...new Map(activities.map(a => [a.cityId._id, a.cityId])).values()];
      // Similar activities (optional: based on category of first match)
      const category = activities[0]?.category;
      let similar = [];
      if (category) {
        similar = await Activity.find({ category, _id: { $nin: activities.map(a => a._id) } })
          .populate("cityId")
          .limit(5)
          .lean();
      }

      return res.json({
        type: "activity",
        activities,
        cities,
        similar
      });
    }

    return res.status(404).json({ message: "No results found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") return res.json([]);

    const regex = new RegExp(q, "i");

    const cityMatches = await City.find({ name: regex }).limit(5).select("name").lean();
    const activityMatches = await Activity.find({ name: regex }).limit(5).select("name").lean();

    const suggestions = [
      ...cityMatches.map(c => c.name),
      ...activityMatches.map(a => a.name),
    ];

    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});


export default router;
