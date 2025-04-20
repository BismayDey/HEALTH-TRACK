"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Activity,
  Heart,
  Droplet,
  Thermometer,
} from "lucide-react";
import Link from "next/link";

// Define types for form data and prediction result
type FormData = {
  age: string;
  gender: string;
  total_bilirubin: string;
  direct_bilirubin: string;
  alkphos: string;
  sgpt: string;
  sgot: string;
};

type PredictionResult = {
  prediction: string;
  confidence: string;
};

export default function LiverDiseasePredictor() {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "0",
    total_bilirubin: "",
    direct_bilirubin: "",
    alkphos: "",
    sgpt: "",
    sgot: "",
  });

  // State for prediction result, loading state, and error
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [formProgress, setFormProgress] = useState<number>(0);

  // Update progress bar based on filled fields
  useEffect(() => {
    const filledFields = Object.values(formData).filter(
      (value) => value !== ""
    ).length;
    const totalFields = Object.keys(formData).length;
    setFormProgress((filledFields / totalFields) * 100);
  }, [formData]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Validate form data
    if (!validateForm()) {
      setIsLoading(false);
      setError("Please fill in all fields with valid values.");
      return;
    }

    // Prepare data for API
    const data = {
      age: Number.parseInt(formData.age),
      gender: Number.parseInt(formData.gender),
      total_bilirubin: Number.parseFloat(formData.total_bilirubin),
      direct_bilirubin: Number.parseFloat(formData.direct_bilirubin),
      alkphos: Number.parseInt(formData.alkphos),
      sgpt: Number.parseInt(formData.sgpt),
      sgot: Number.parseInt(formData.sgot),
    };

    try {
      const response = await fetch(
        "https://liver-disease-api.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      setError("Error: Unable to get prediction. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    return (
      formData.age !== "" &&
      formData.total_bilirubin !== "" &&
      formData.direct_bilirubin !== "" &&
      formData.alkphos !== "" &&
      formData.sgpt !== "" &&
      formData.sgot !== ""
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      age: "",
      gender: "0",
      total_bilirubin: "",
      direct_bilirubin: "",
      alkphos: "",
      sgpt: "",
      sgot: "",
    });
    setResult(null);
    setError(null);
    setActiveSection(0);
  };

  // Form sections
  const sections = [
    {
      title: "Personal Information",
      icon: <Heart className="w-5 h-5" />,
      fields: ["age", "gender"],
    },
    {
      title: "Bilirubin Levels",
      icon: <Droplet className="w-5 h-5" />,
      fields: ["total_bilirubin", "direct_bilirubin"],
    },
    {
      title: "Enzyme Levels",
      icon: <Activity className="w-5 h-5" />,
      fields: ["alkphos", "sgpt", "sgot"],
    },
  ];

  // Field labels and units
  const fieldInfo = {
    age: { label: "Age", unit: "years", placeholder: "Enter your age" },
    gender: { label: "Gender", unit: "", placeholder: "Select gender" },
    total_bilirubin: {
      label: "Total Bilirubin",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "0.1-1.2 mg/dL",
    },
    direct_bilirubin: {
      label: "Direct Bilirubin",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "0-0.3 mg/dL",
    },
    alkphos: {
      label: "Alkaline Phosphotase",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "44-147 IU/L",
    },
    sgpt: {
      label: "SGPT (ALT)",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "7-56 IU/L",
    },
    sgot: {
      label: "SGOT (AST)",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "5-40 IU/L",
    },
  };

  return (
    <div className="min-h-screen bg-[#0284c7]/10 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header with logo and return button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg mr-3">
              <Thermometer className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Liver Health Predictor
            </h1>
          </div>
          <Link href="/" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded-lg shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Return Home
            </motion.button>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 overflow-hidden">
          <motion.div
            className="bg-blue-600 h-2.5"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Navigation sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Assessment Steps
            </h2>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === index
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      activeSection === index ? "bg-blue-100" : "bg-gray-200"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </motion.button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || !validateForm()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 font-medium"
              >
                {isLoading ? "Processing..." : "Predict Results"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-medium"
              >
                Reset All Fields
              </motion.button>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  {sections[activeSection].icon}
                  <span className="ml-2">{sections[activeSection].title}</span>
                </h2>

                <div className="space-y-6">
                  {sections[activeSection].fields.map((fieldId) => (
                    <div key={fieldId} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <label
                          htmlFor={fieldId}
                          className="block text-sm font-medium text-gray-700 group-focus-within:text-blue-600"
                        >
                          {fieldInfo[fieldId as keyof typeof fieldInfo].label}
                        </label>
                        {fieldInfo[fieldId as keyof typeof fieldInfo]
                          .normal && (
                          <span className="text-xs text-gray-500">
                            Normal:{" "}
                            {
                              fieldInfo[fieldId as keyof typeof fieldInfo]
                                .normal
                            }
                          </span>
                        )}
                      </div>

                      {fieldId === "gender" ? (
                        <div className="flex space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, gender: "0" }))
                            }
                            className={`flex-1 cursor-pointer p-4 rounded-xl border-2 ${
                              formData.gender === "0"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-4 h-4 rounded-full mr-2 ${
                                  formData.gender === "0"
                                    ? "bg-blue-500"
                                    : "bg-gray-200"
                                }`}
                              />
                              <span
                                className={
                                  formData.gender === "0"
                                    ? "font-medium text-blue-700"
                                    : "text-gray-700"
                                }
                              >
                                Female
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, gender: "1" }))
                            }
                            className={`flex-1 cursor-pointer p-4 rounded-xl border-2 ${
                              formData.gender === "1"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-4 h-4 rounded-full mr-2 ${
                                  formData.gender === "1"
                                    ? "bg-blue-500"
                                    : "bg-gray-200"
                                }`}
                              />
                              <span
                                className={
                                  formData.gender === "1"
                                    ? "font-medium text-blue-700"
                                    : "text-gray-700"
                                }
                              >
                                Male
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="number"
                            step={fieldId.includes("bilirubin") ? "0.1" : "1"}
                            id={fieldId}
                            value={formData[fieldId as keyof FormData]}
                            onChange={handleChange}
                            placeholder={
                              fieldInfo[fieldId as keyof typeof fieldInfo]
                                .placeholder
                            }
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          />
                          {fieldInfo[fieldId as keyof typeof fieldInfo]
                            .unit && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-gray-500">
                                {
                                  fieldInfo[fieldId as keyof typeof fieldInfo]
                                    .unit
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  {activeSection > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(activeSection - 1)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Previous
                    </motion.button>
                  ) : (
                    <div></div>
                  )}

                  {activeSection < sections.length - 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
                    >
                      Next Step
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Results section */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative w-20 h-20">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
                      <motion.div
                        className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full"
                        style={{
                          borderTopColor: "transparent",
                          borderRightColor: "transparent",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Analyzing Your Data
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Our algorithm is processing your health parameters...
                    </p>
                  </div>
                </motion.div>
              )}

              {result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl shadow-xl p-6 overflow-hidden ${
                    result.prediction.includes("No")
                      ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
                      : "bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-full mr-4 ${
                        result.prediction.includes("No")
                          ? "bg-green-200"
                          : "bg-red-200"
                      }`}
                    >
                      {result.prediction.includes("No") ? (
                        <CheckCircle
                          className={`h-8 w-8 ${
                            result.prediction.includes("No")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      ) : (
                        <AlertCircle
                          className={`h-8 w-8 ${
                            result.prediction.includes("No")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          result.prediction.includes("No")
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {result.prediction}
                      </h3>
                      <div className="mt-2 space-y-2">
                        <p
                          className={`text-sm ${
                            result.prediction.includes("No")
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          Confidence:{" "}
                          <span className="font-semibold">
                            {result.confidence}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {result.prediction.includes("No")
                            ? "Based on the provided parameters, our model predicts a lower risk of liver disease. However, this is not a medical diagnosis."
                            : "Based on the provided parameters, our model predicts a higher risk of liver disease. We recommend consulting with a healthcare professional."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-200 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-sm text-center text-gray-500 bg-white p-4 rounded-xl shadow-sm"
        >
          <p>
            This tool is for educational purposes only and should not replace
            professional medical advice.
          </p>
          <p className="mt-1">
            Always consult with a healthcare professional for medical concerns.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
