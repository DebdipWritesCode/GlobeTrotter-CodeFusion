import City from "../models/City.js";
import Activity from "../models/Activity.js";
import axios from "axios";

export const createCity = async (req, res) => {
  try {
    const { name, country, costIndex, popularityScore, description, images } = req.body;

    const city = new City({
      name,
      country,
      costIndex,
      popularityScore,
      description,
      images
    });

    const savedCity = await city.save();

    // === Call GPT service to generate activities for this city ===
    // Replace URL with your FastAPI endpoint
    const response = await axios.post("http://localhost:8000/v1/activities", {
      city_name: name
    });

    const generatedActivities = response.data.activities || [];

    // Prepare activities for DB insertion, linking cityId
    const activityDocs = generatedActivities.map((act) => ({
      name: act.name,
      description: act.description || "",
      category: act.category || "other",
      cost: act.cost || 0,
      duration: act.duration || 0,
      cityId: savedCity._id,
      images: [], // no images for now
    }));

    // Insert activities into DB
    if (activityDocs.length > 0) {
      await Activity.insertMany(activityDocs);
    }

    res.status(201).json({
      message: "City and activities created successfully",
      city: savedCity,
      activitiesCreated: activityDocs.length,
    });
  } catch (error) {
    console.error("Error creating city and activities:", error);
    res.status(500).json({ message: "Server error creating city and activities" });
  }
};


// UPDATE city
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCity = await City.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true
    });

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City updated successfully", city: updatedCity });
  } catch (error) {
    console.error("Error updating city:", error);
    res.status(500).json({ message: "Server error updating city" });
  }
};

// DELETE city
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCity = await City.findByIdAndDelete(id);

    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ message: "Server error deleting city" });
  }
};



export const getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ popularityScore: -1 });
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Server error fetching cities" });
  }
};

// GET single city
export const getCity = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ message: "Server error fetching city" });
  }
};
