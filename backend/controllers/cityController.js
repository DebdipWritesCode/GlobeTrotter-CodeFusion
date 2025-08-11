import City from "../models/City.js";

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
    res.status(201).json({ message: "City created successfully", city: savedCity });
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ message: "Server error creating city" });
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
