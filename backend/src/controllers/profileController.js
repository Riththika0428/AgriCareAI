import Profile from "../models/Profile.js";
import User    from "../models/User.js";

// ── GET my profile ─────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate("user", "name email role");
    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CREATE or UPDATE profile (upsert) ─────────────────────
export const upsertProfile = async (req, res) => {
  try {
    const {
      // Step 1
      phone, state, district, village, bio,
      // Step 2 (farmer)
      farmName, farmSize, farmSizeUnit, farmingType,
      irrigationType, soilType, experience,
      // Step 3 (farmer)
      crops,
      // Consumer
      dietaryPreferences, healthGoals, deliveryAddress,
      // completion flag
      isComplete,
    } = req.body;

    const updateData = {
      user: req.user._id,
      role: req.user.role === "farmer" ? "farmer" : "user",
    };

    // Only set fields that were sent
    if (phone        !== undefined) updateData.phone        = phone;
    if (state        !== undefined) updateData.state        = state;
    if (district     !== undefined) updateData.district     = district;
    if (village      !== undefined) updateData.village      = village;
    if (bio          !== undefined) updateData.bio          = bio;
    if (farmName     !== undefined) updateData.farmName     = farmName;
    if (farmSize     !== undefined) updateData.farmSize     = farmSize;
    if (farmSizeUnit !== undefined) updateData.farmSizeUnit = farmSizeUnit;
    if (farmingType  !== undefined) updateData.farmingType  = farmingType;
    if (irrigationType !== undefined) updateData.irrigationType = irrigationType;
    if (soilType     !== undefined) updateData.soilType     = soilType;
    if (experience   !== undefined) updateData.experience   = experience;
    if (crops        !== undefined) updateData.crops        = crops;
    if (dietaryPreferences !== undefined) updateData.dietaryPreferences = dietaryPreferences;
    if (healthGoals  !== undefined) updateData.healthGoals  = healthGoals;
    if (deliveryAddress !== undefined) updateData.deliveryAddress = deliveryAddress;
    if (isComplete   !== undefined) updateData.isComplete   = isComplete;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name email role");

    res.status(200).json({ message: "Profile saved.", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CHECK if profile is complete ───────────────────────────
export const checkProfileComplete = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json({ isComplete: profile?.isComplete || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN: get all profiles ────────────────────────────────
export const adminGetAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("user", "name email role")
      .sort("-createdAt");
    res.json({ count: profiles.length, profiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};