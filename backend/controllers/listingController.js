import Listing from "../models/Listing.js";

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    return res.status(200).json(listings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getListing = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.find(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    return res.status(200).json(listing);
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getListingByHostId = async (req, res) => {
  try {
    const hostId = req.params.hostId;
    const listing = await Listing.find({ host_id: hostId });
    return res.status(200).json(listing);
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Listing ID is required" });
    }
    const deletedListing = await Listing.findOneAndDelete({ _id: id });
    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    return res
      .status(200)
      .json({ message: `Listing ${id} was successfully deleted` });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createListing = async (req, res) => {
  try {
    const {
      host_id,
      charger_type,
      power_output_kw,
      connector_type,
      address,
      latitude,
      longitude,
      availability_schedule,
      price_per_hour,
      min_price,
      images,
      instructions,
      is_active = true,
    } = req.body;

    const newListing = new Listing({
      host_id,
      charger_type,
      power_output_kw,
      connector_type,
      address,
      latitude,
      longitude,
      availability_schedule,
      price_per_hour,
      min_price,
      images,
      instructions,
      is_active,
    });
    const savedListing = await newListing.save();

    return res.status(201).json(savedListing);
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const updateFields = { ...req.body };

    updateFields.updated_at = Date.now();

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
