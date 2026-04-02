"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AdvisoryPage() {
  const [formData, setFormData] = useState({
    crop_type: "Rice",
    growth_stage: "Vegetative",
    district: "Anuradhapura",
    symptoms_description: "",
    vision_analysis_results: "",
    nitrogen_level: "",
    phosphorus_level: "",
    potassium_level: "",
    soil_ph: "",
    soil_observations: "",
    temperature: "30",
    rainfall: "5",
    humidity: "75",
    wind_speed: "10",
    weather_alerts: "None",
    forecast: "Sunny with occasional showers",
  });

  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdvisoryResult(null);
    setError(null);

    try {
      // Send the request to our backend
      const response = await axios.post("http://localhost:5000/api/advisory", formData, {
        headers: { "Content-Type": "application/json" }
      });
      setAdvisoryResult(response.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while fetching the AI advisory."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-8">
          AI Agricultural Advisory
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-green-50">
            <h3 className="text-lg leading-6 font-medium text-green-900">
              Farm Details & Conditions
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-green-700">
              Fill in the details below to receive actionable farming advice tailored to your situation.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Basic Crop Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Crop Type</label>
                  <input
                    type="text"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Growth Stage</label>
                  <input
                    type="text"
                    name="growth_stage"
                    value={formData.growth_stage}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">District (Sri Lanka)</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Weather Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                  <input
                    type="text"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rainfall (mm)</label>
                  <input
                    type="text"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Humidity (%)</label>
                  <input
                    type="text"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Disease and Symptoms */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observed Symptoms</label>
                  <textarea
                    name="symptoms_description"
                    value={formData.symptoms_description}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                    placeholder="E.g. yellowing leaves, brown spots"
                  ></textarea>
                </div>
                
                {/* Soil Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nitrogen Level (ppm)</label>
                  <input
                    type="text"
                    name="nitrogen_level"
                    value={formData.nitrogen_level}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Soil pH</label>
                  <input
                    type="text"
                    name="soil_ph"
                    value={formData.soil_ph}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-green-500 focus:border-green-500"
                  />
                </div>

              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Generate AI Advisory"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {advisoryResult && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-green-600">
              <h3 className="text-lg leading-6 font-medium text-white">
                Comprehensive AI Action Plan
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 p-6 prose max-w-none text-black whitespace-pre-line">
              {advisoryResult}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
