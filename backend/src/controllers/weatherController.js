import WeatherAlert from "../models/WeatherAlert.js";

// ── District to coordinates mapping (Sri Lanka) ──
const DISTRICT_COORDS = {
  "Colombo":      { lat: 6.9271,  lon: 79.8612 },
  "Gampaha":      { lat: 7.0917,  lon: 80.0000 },
  "Kalutara":     { lat: 6.5854,  lon: 79.9607 },
  "Kandy":        { lat: 7.2906,  lon: 80.6337 },
  "Matale":       { lat: 7.4675,  lon: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497,  lon: 80.7891 },
  "Galle":        { lat: 6.0535,  lon: 80.2210 },
  "Matara":       { lat: 5.9549,  lon: 80.5550 },
  "Hambantota":   { lat: 6.1241,  lon: 81.1185 },
  "Jaffna":       { lat: 9.6615,  lon: 80.0255 },
  "Kilinochchi":  { lat: 9.3803,  lon: 80.3770 },
  "Mannar":       { lat: 8.9810,  lon: 79.9044 },
  "Vavuniya":     { lat: 8.7514,  lon: 80.4971 },
  "Mullaitivu":   { lat: 9.2671,  lon: 80.8128 },
  "Batticaloa":   { lat: 7.7310,  lon: 81.6747 },
  "Ampara":       { lat: 7.2953,  lon: 81.6747 },
  "Trincomalee":  { lat: 8.5874,  lon: 81.2152 },
  "Kurunegala":   { lat: 7.4818,  lon: 80.3609 },
  "Puttalam":     { lat: 8.0362,  lon: 79.8283 },
  "Anuradhapura": { lat: 8.3114,  lon: 80.4037 },
  "Polonnaruwa":  { lat: 7.9403,  lon: 81.0188 },
  "Badulla":      { lat: 6.9934,  lon: 81.0550 },
  "Moneragala":   { lat: 6.8728,  lon: 81.3507 },
  "Ratnapura":    { lat: 6.7056,  lon: 80.3847 },
  "Kegalle":      { lat: 7.2513,  lon: 80.3464 },
};

// ── Determine alert level from weather data ──
const getAlertLevel = (rainfall, windSpeed, temperature) => {
  if (rainfall > 100 || windSpeed > 60 || temperature > 38) return "Danger";
  if (rainfall > 50  || windSpeed > 40 || temperature > 35) return "Warning";
  if (rainfall > 20  || windSpeed > 25 || temperature > 32) return "Watch";
  return "Normal";
};

// ── Generate crop advice based on weather ──
const getCropAdvice = (condition, rainfall, temperature, alertLevel) => {
  if (alertLevel === "Danger") {
    return "⚠️ Extreme weather alert! Secure all crops and farm equipment immediately. Avoid field work today.";
  }
  if (alertLevel === "Warning") {
    return "🌧️ Heavy rain expected. Ensure proper drainage in fields. Postpone fertilizer application. Check for waterlogging.";
  }
  if (condition?.toLowerCase().includes("rain")) {
    return "🌦️ Light rain expected. Good for irrigation — reduce manual watering. Watch for fungal diseases in humid conditions.";
  }
  if (temperature > 32) {
    return "☀️ High temperature today. Water crops early morning or evening. Mulch to retain soil moisture.";
  }
  if (temperature < 15) {
    return "🥶 Cool weather. Protect sensitive crops from cold stress. Ideal conditions for leafy green growth.";
  }
  return "✅ Weather conditions are normal. Good day for regular farm activities including planting and harvesting.";
};

// ─────────────────────────────────────────────────────
// GET WEATHER FOR A DISTRICT
// GET /api/weather/:district
// Public — no token needed
// Fetches live data from OpenWeatherMap
// ─────────────────────────────────────────────────────
export const getWeatherByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const coords = DISTRICT_COORDS[district];

    if (!coords) {
      return res.status(400).json({ message: `District "${district}" not found.` });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key not configured." });
    }

    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    );
    const currentData = await currentRes.json();

    if (!currentRes.ok) {
      return res.status(502).json({ message: "Failed to fetch weather data." });
    }

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    // Process current weather
    const temperature = Math.round(currentData.main.temp);
    const humidity    = currentData.main.humidity;
    const rainfall    = currentData.rain?.["1h"] || 0;
    const windSpeed   = Math.round(currentData.wind.speed * 3.6); // m/s to km/h
    const condition   = currentData.weather[0].main;
    const description = currentData.weather[0].description;

    const alertLevel = getAlertLevel(rainfall, windSpeed, temperature);
    const cropAdvice = getCropAdvice(condition, rainfall, temperature, alertLevel);

    // Process 3-day forecast (one entry per day at 12:00)
    const dailyMap = {};
    forecastData.list?.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap[date] && item.dt_txt.includes("12:00")) {
        dailyMap[date] = {
          date,
          condition: item.weather[0].main,
          tempMin:   Math.round(item.main.temp_min),
          tempMax:   Math.round(item.main.temp_max),
          rainfall:  item.rain?.["3h"] || 0,
          humidity:  item.main.humidity,
        };
      }
    });
    const forecast = Object.values(dailyMap).slice(0, 3);

    res.json({
      district,
      temperature,
      humidity,
      rainfall,
      windSpeed,
      condition,
      description,
      alertLevel,
      cropAdvice,
      forecast,
      fetchedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
// SAVE WEATHER ALERT FOR FARMER
// POST /api/weather/save
// Protected — farmer only
// Saves current weather data to farmer's record
// ─────────────────────────────────────────────────────
export const saveWeatherAlert = async (req, res) => {
  try {
    const {
      district, temperature, humidity, rainfall,
      windSpeed, condition, description, alertLevel,
      cropAdvice, forecast,
    } = req.body;

    if (!district) {
      return res.status(400).json({ message: "District is required." });
    }

    // Check if farmer already has an alert for this district
    // If yes — update it. If no — create new.
    const existing = await WeatherAlert.findOne({
      farmer: req.user._id,
      district,
    });

    if (existing) {
      existing.temperature = temperature;
      existing.humidity    = humidity;
      existing.rainfall    = rainfall;
      existing.windSpeed   = windSpeed;
      existing.condition   = condition;
      existing.description = description;
      existing.alertLevel  = alertLevel;
      existing.cropAdvice  = cropAdvice;
      existing.forecast    = forecast;
      existing.fetchedAt   = new Date();
      await existing.save();
      return res.json({ message: "Weather alert updated.", alert: existing });
    }

    const alert = await WeatherAlert.create({
      farmer:      req.user._id,
      district,
      temperature,
      humidity,
      rainfall,
      windSpeed,
      condition,
      description,
      alertLevel,
      cropAdvice,
      forecast,
      fetchedAt: new Date(),
    });

    res.status(201).json({ message: "Weather alert saved.", alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
// GET MY WEATHER ALERTS
// GET /api/weather/my
// Protected — farmer sees their saved alerts
// ─────────────────────────────────────────────────────
export const getMyWeatherAlerts = async (req, res) => {
  try {
    const alerts = await WeatherAlert.find({ farmer: req.user._id })
      .sort("-fetchedAt");
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
// DELETE WEATHER ALERT
// DELETE /api/weather/:id
// Protected — farmer can delete their own alerts
// ─────────────────────────────────────────────────────
export const deleteWeatherAlert = async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    if (alert.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorised." });
    }

    await alert.deleteOne();
    res.json({ message: "Alert deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
// ADMIN — GET ALL WEATHER ALERTS
// GET /api/weather/admin/all
// Admin only
// ─────────────────────────────────────────────────────
export const adminGetAllAlerts = async (req, res) => {
  try {
    const alerts = await WeatherAlert.find()
      .populate("farmer", "name email")
      .sort("-fetchedAt");
    res.json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
// GET ALL DISTRICTS LIST
// GET /api/weather/districts
// Public — returns all available districts
// ─────────────────────────────────────────────────────
export const getDistricts = (req, res) => {
  const districts = Object.keys(DISTRICT_COORDS);
  res.json({ districts });
};