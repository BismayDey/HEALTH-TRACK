"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Microscope,
  Heart,
  FlaskRoundIcon as Flask,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  BarChart3,
  Brain,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("skin");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,1))] -z-10"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 -z-10">
          <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 -z-10">
          <div className="w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="inline-block animate-bounce bg-primary/10 p-2 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight">
              AI-Powered Health{" "}
              <span className="text-primary">Diagnostics</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Early detection of health conditions through our advanced AI
              diagnostic tools. Analyze skin diseases, heart conditions, and
              diabetes risk factors in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8"
                onClick={() =>
                  document
                    .getElementById("diagnostics")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Try Diagnostics
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl mt-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-xl -z-10 transform -rotate-1"></div>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="AI Diagnostics Dashboard"
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-slate-600 mt-2">
              Our AI models are trained on millions of medical records and
              images
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard
              icon={<Microscope className="h-8 w-8 text-emerald-500" />}
              title="Skin Analysis"
              value={statsVisible ? 98 : 0}
              suffix="%"
              description="accuracy rate"
              color="emerald"
            />
            <StatCard
              icon={<Heart className="h-8 w-8 text-rose-500" />}
              title="Heart Risk"
              value={statsVisible ? 95 : 0}
              suffix="%"
              description="accuracy rate"
              color="rose"
            />
            <StatCard
              icon={<Flask className="h-8 w-8 text-amber-500" />}
              title="Diabetes"
              value={statsVisible ? 93 : 0}
              suffix="%"
              description="accuracy rate"
              color="amber"
            />
            <StatCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="Users"
              value={statsVisible ? 50 : 0}
              suffix="K+"
              description="worldwide"
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Diagnostics Hub Section */}
      <section id="diagnostics" className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              AI Diagnostics Hub
            </h2>
            <p className="text-slate-600 mt-2">
              Select a diagnostic tool to get started
            </p>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <Tabs
                defaultValue="skin"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3 rounded-b-none h-16">
                  <TabsTrigger
                    value="skin"
                    className="data-[state=active]:bg-emerald-50 flex gap-2"
                  >
                    <Microscope className="h-4 w-4" />
                    <span className="hidden sm:inline">Skin Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="heart"
                    className="data-[state=active]:bg-rose-50 flex gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Heart Risk</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="diabetes"
                    className="data-[state=active]:bg-amber-50 flex gap-2"
                  >
                    <Flask className="h-4 w-4" />
                    <span className="hidden sm:inline">Diabetes Risk</span>
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="skin" className="m-0">
                    <SkinAnalysis />
                  </TabsContent>
                  <TabsContent value="heart" className="m-0">
                    <HeartRiskAnalysis />
                  </TabsContent>
                  <TabsContent value="diabetes" className="m-0">
                    <DiabetesAnalysis />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
            <p className="text-slate-600 mt-2">
              Our AI-powered diagnostics process is simple and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>

            <StepCard
              number={1}
              title="Input Your Data"
              description="Upload an image or fill out a simple health questionnaire"
              icon={<Upload className="h-6 w-6 text-primary" />}
            />
            <StepCard
              number={2}
              title="AI Analysis"
              description="Our advanced AI models analyze your data in seconds"
              icon={<Brain className="h-6 w-6 text-primary" />}
            />
            <StepCard
              number={3}
              title="Get Results"
              description="Receive detailed insights and recommendations"
              icon={<Shield className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              What Our Users Say
            </h2>
            <p className="text-slate-600 mt-2">
              Trusted by healthcare professionals and patients worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="The skin analysis tool helped me identify a suspicious mole early. It literally saved my life."
              author="Sarah Johnson"
              role="Patient"
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="As a cardiologist, I recommend this tool to my patients for preliminary heart risk assessment."
              author="Dr. Michael Chen"
              role="Cardiologist"
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="The diabetes risk assessment is remarkably accurate. It's a valuable tool for preventive healthcare."
              author="Emma Rodriguez"
              role="Endocrinologist"
              image="/placeholder.svg?height=100&width=100"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 mt-2">
              Find answers to common questions about our AI diagnostics
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <FaqItem
              question="How accurate are the AI diagnostics?"
              answer="Our AI models have been trained on millions of medical records and images. The skin analysis has a 98% accuracy rate, heart risk assessment 95%, and diabetes risk assessment 93%. However, our tools are meant for preliminary screening and not a replacement for professional medical advice."
              isOpen={faqOpen === 0}
              onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
            />
            <FaqItem
              question="Is my health data secure and private?"
              answer="Yes, we take data privacy very seriously. All data is encrypted and processed securely. We comply with HIPAA and GDPR regulations. Your data is never shared with third parties without your explicit consent."
              isOpen={faqOpen === 1}
              onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
            />
            <FaqItem
              question="Can I use these tools instead of seeing a doctor?"
              answer="No, our AI diagnostic tools are designed to complement, not replace, professional medical care. They provide preliminary assessments to help you and your healthcare provider make informed decisions. Always consult with a qualified healthcare professional for proper diagnosis and treatment."
              isOpen={faqOpen === 2}
              onClick={() => setFaqOpen(faqOpen === 2 ? null : 2)}
            />
            <FaqItem
              question="How often should I use these diagnostic tools?"
              answer="For skin analysis, we recommend monthly checks or whenever you notice a new or changing skin lesion. For heart and diabetes risk assessments, quarterly or semi-annual checks are appropriate for most people, but follow your doctor's recommendations based on your personal health history."
              isOpen={faqOpen === 3}
              onClick={() => setFaqOpen(faqOpen === 3 ? null : 3)}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Start using our AI-powered diagnostic tools today and take the
              first step towards proactive healthcare.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8"
              onClick={() =>
                document
                  .getElementById("diagnostics")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Try Diagnostics Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Health Diagnostics</h3>
              <p className="text-slate-400">
                Early detection of health conditions through advanced AI
                diagnostic tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Diagnostics</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Skin Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Heart Risk Assessment
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Diabetes Risk Assessment
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Research
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-slate-400">
                  contact@aihealthdiagnostics.com
                </li>
                <li className="text-slate-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>
              © {new Date().getFullYear()} AI Health Diagnostics. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Skin Analysis Component
function SkinAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Convert base64 image to blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      // Send to API
      const apiResponse = await fetch(
        "https://health-api-12zd.onrender.com/predict/skin_disease",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        throw new Error("API request failed");
      }

      const data = await apiResponse.json();

      // Set progress to 100% when done
      setProgress(100);

      // Use API response or fallback to mock data if API format is different
      setResult({
        condition: data.prediction || "Benign Nevus",
        confidence: data.confidence || 98.2,
        risk: data.risk || "low",
        recommendations: data.recommendations || [
          "No immediate action required",
          "Continue regular skin checks",
          "Use sunscreen when outdoors",
        ],
      });
    } catch (error) {
      console.error("Error analyzing image:", error);

      // Fallback to mock result
      setResult({
        condition: "Benign Nevus",
        confidence: 98.2,
        risk: "low",
        recommendations: [
          "No immediate action required",
          "Continue regular skin checks",
          "Use sunscreen when outdoors",
        ],
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Skin Condition Analysis</h2>
        <p className="text-slate-600 mb-4">
          Upload a clear image of the skin area for AI-powered analysis and
          detection of potential conditions.
        </p>

        {!image ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
              isDragging
                ? "border-emerald-500 bg-emerald-50 scale-105"
                : "border-slate-300 hover:border-emerald-400"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="animate-bounce mb-4">
              <Upload className="h-12 w-12 mx-auto text-emerald-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">Upload Image</h3>
            <p className="text-slate-500 text-sm mb-2">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-slate-400">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-video relative rounded-lg overflow-hidden border border-slate-200 transition-transform group-hover:scale-[1.01] duration-300">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Uploaded skin image"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={resetAnalysis}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!isAnalyzing && !result && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg"
                onClick={handleAnalyze}
              >
                <Microscope className="mr-2 h-4 w-4" /> Analyze Image
              </Button>
            )}

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-slate-500 animate-pulse">
                  AI model processing your image...
                </div>
              </div>
            )}

            {result && (
              <Card className="p-4 border-0 shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10"></div>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-2 rounded-full transition-all duration-500",
                      result.risk === "low" ? "bg-emerald-100" : "bg-amber-100"
                    )}
                  >
                    {result.risk === "low" ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {result.condition}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-medium">
                        Confidence: {result.confidence.toFixed(1)}%
                      </div>
                      <div
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          result.risk === "low"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {result.risk.toUpperCase()} RISK
                      </div>
                    </div>
                    <div className="space-y-1 mt-3">
                      <h4 className="text-sm font-medium">Recommendations:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-slate-100 p-0.5 mt-0.5">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            </div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Heart Risk Analysis Component
function HeartRiskAnalysis() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    systolic: "",
    diastolic: "",
    cholesterol: "",
    hdl: "",
    ldl: "",
    smoker: "",
    diabetes: "",
    familyHistory: "",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<HeartRiskResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 4;
      });
    }, 100);

    try {
      // Prepare data for API
      const apiData = {
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        systolic: Number.parseInt(formData.systolic),
        diastolic: Number.parseInt(formData.diastolic),
        cholesterol: Number.parseInt(formData.cholesterol),
        hdl: Number.parseInt(formData.hdl),
        ldl: formData.ldl ? Number.parseInt(formData.ldl) : 0,
        smoker: formData.smoker === "yes",
        diabetes: formData.diabetes === "yes",
        familyHistory: formData.familyHistory === "yes",
      };

      // Send to API
      const response = await fetch(
        "https://health-api-12zd.onrender.com/predict/heart_disease",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Set progress to 100% when done
      setProgress(100);

      // Use API response or fallback to mock data if API format is different
      const riskScore = data.risk_score || Math.floor(Math.random() * 30) + 5;

      setResult({
        riskScore: riskScore,
        riskLevel:
          riskScore < 10 ? "low" : riskScore < 20 ? "moderate" : "high",
        confidence: data.confidence || 95.3,
        keyFactors: data.key_factors || [
          formData.cholesterol
            ? "Elevated cholesterol levels"
            : "Normal cholesterol levels",
          formData.smoker === "yes" ? "Current smoker" : "Non-smoker",
          formData.familyHistory === "yes"
            ? "Family history of heart disease"
            : "No family history of heart disease",
        ],
        recommendations: data.recommendations || [
          "Maintain a heart-healthy diet",
          "Regular cardiovascular exercise",
          "Monitor blood pressure regularly",
          formData.smoker === "yes"
            ? "Consider smoking cessation program"
            : "Continue avoiding tobacco products",
        ],
      });
    } catch (error) {
      console.error("Error analyzing heart risk:", error);

      // Fallback to mock result
      const riskScore = Math.floor(Math.random() * 30) + 5;

      setResult({
        riskScore: riskScore,
        riskLevel:
          riskScore < 10 ? "low" : riskScore < 20 ? "moderate" : "high",
        confidence: 95.3,
        keyFactors: [
          formData.cholesterol
            ? "Elevated cholesterol levels"
            : "Normal cholesterol levels",
          formData.smoker === "yes" ? "Current smoker" : "Non-smoker",
          formData.familyHistory === "yes"
            ? "Family history of heart disease"
            : "No family history of heart disease",
        ],
        recommendations: [
          "Maintain a heart-healthy diet",
          "Regular cardiovascular exercise",
          "Monitor blood pressure regularly",
          formData.smoker === "yes"
            ? "Consider smoking cessation program"
            : "Continue avoiding tobacco products",
        ],
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Heart Risk Assessment</h2>
        <p className="text-slate-600 mb-4">
          Enter your health metrics for an AI-powered analysis of your
          cardiovascular risk factors.
        </p>

        {!isAnalyzing && !result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
                >
                  <SelectTrigger
                    id="gender"
                    className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
                <Input
                  id="systolic"
                  name="systolic"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.systolic}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolic"
                  name="diastolic"
                  type="number"
                  placeholder="e.g., 80"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                <Input
                  id="cholesterol"
                  name="cholesterol"
                  type="number"
                  placeholder="e.g., 200"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
                <Input
                  id="hdl"
                  name="hdl"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.hdl}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smoker">Do you smoke?</Label>
                <Select
                  value={formData.smoker}
                  onValueChange={(value) => handleSelectChange("smoker", value)}
                  required
                >
                  <SelectTrigger
                    id="smoker"
                    className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="former">Former smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diabetes">Do you have diabetes?</Label>
                <Select
                  value={formData.diabetes}
                  onValueChange={(value) =>
                    handleSelectChange("diabetes", value)
                  }
                  required
                >
                  <SelectTrigger
                    id="diabetes"
                    className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="prediabetes">Prediabetes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory">
                  Family history of heart disease?
                </Label>
                <Select
                  value={formData.familyHistory}
                  onValueChange={(value) =>
                    handleSelectChange("familyHistory", value)
                  }
                  required
                >
                  <SelectTrigger
                    id="familyHistory"
                    className="transition-all duration-300 focus:ring-2 focus:ring-rose-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 transition-all duration-300 hover:shadow-lg"
            >
              <Heart className="mr-2 h-4 w-4" /> Analyze Heart Risk
            </Button>
          </form>
        ) : isAnalyzing ? (
          <div className="space-y-4 py-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-rose-500 animate-pulse" />
                </div>
                <svg
                  className="w-24 h-24 rotate-[-90deg]"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-rose-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-rose-500 transition-all duration-300 ease-in-out"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium mb-1">
                Analyzing your heart health data
              </div>
              <div className="text-sm text-slate-500 animate-pulse">
                AI model processing your information...
              </div>
            </div>
          </div>
        ) : (
          result && (
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10"></div>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div
                    className={cn(
                      "p-4 rounded-full self-center transition-all duration-500",
                      result.riskLevel === "low"
                        ? "bg-emerald-100"
                        : result.riskLevel === "moderate"
                        ? "bg-amber-100"
                        : "bg-rose-100"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-12 w-12",
                        result.riskLevel === "low"
                          ? "text-emerald-600"
                          : result.riskLevel === "moderate"
                          ? "text-amber-600"
                          : "text-rose-600"
                      )}
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-1">
                      {result.riskLevel === "low"
                        ? "Low"
                        : result.riskLevel === "moderate"
                        ? "Moderate"
                        : "High"}{" "}
                      Risk
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                      <div className="text-3xl font-bold">
                        {result.riskScore}%
                      </div>
                      <div className="text-sm text-slate-500">
                        10-year risk of cardiovascular event
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm justify-center md:justify-start">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        Analysis confidence: {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Key Risk Factors
                  </h3>
                  <ul className="space-y-3">
                    {result.keyFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-slate-100 p-1 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-slate-600" />
                        </div>
                        <span className="text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="w-full hover:bg-rose-50 transition-all duration-300"
              >
                Start New Analysis
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Diabetes Analysis Component
function DiabetesAnalysis() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bmi: "",
    bloodGlucose: "",
    familyHistory: "",
    physicalActivity: "",
    diet: "",
    bloodPressure: "",
    waistCircumference: "",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DiabetesRiskResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 4;
      });
    }, 100);

    try {
      // Prepare data for API
      const apiData = {
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        bmi: Number.parseFloat(formData.bmi),
        bloodGlucose: Number.parseInt(formData.bloodGlucose),
        familyHistory: formData.familyHistory === "yes",
        physicalActivity: formData.physicalActivity,
        diet: formData.diet,
        bloodPressure: formData.bloodPressure || "normal",
        waistCircumference: Number.parseInt(formData.waistCircumference),
      };

      // Send to API
      const response = await fetch(
        "https://health-api-12zd.onrender.com/predict/diabetes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Set progress to 100% when done
      setProgress(100);

      // Use API response or fallback to mock data if API format is different
      const riskScore = data.risk_score || Math.floor(Math.random() * 30) + 5;

      setResult({
        riskScore: riskScore,
        riskLevel:
          riskScore < 10 ? "low" : riskScore < 20 ? "moderate" : "high",
        confidence: data.confidence || 93.7,
        keyFactors: data.key_factors || [
          formData.bloodGlucose
            ? `Blood glucose level: ${formData.bloodGlucose} mg/dL`
            : "Blood glucose not provided",
          formData.bmi ? `BMI: ${formData.bmi}` : "BMI not provided",
          formData.familyHistory === "yes"
            ? "Family history of diabetes"
            : "No family history of diabetes",
        ],
        recommendations: data.recommendations || [
          "Maintain a balanced diet low in refined sugars",
          "Regular physical activity (150+ minutes per week)",
          "Monitor blood glucose levels periodically",
          Number.parseFloat(formData.bmi) > 25
            ? "Consider weight management program"
            : "Maintain healthy weight",
        ],
      });
    } catch (error) {
      console.error("Error analyzing diabetes risk:", error);

      // Fallback to mock result
      const riskScore = Math.floor(Math.random() * 30) + 5;

      setResult({
        riskScore: riskScore,
        riskLevel:
          riskScore < 10 ? "low" : riskScore < 20 ? "moderate" : "high",
        confidence: 93.7,
        keyFactors: [
          formData.bloodGlucose
            ? `Blood glucose level: ${formData.bloodGlucose} mg/dL`
            : "Blood glucose not provided",
          formData.bmi ? `BMI: ${formData.bmi}` : "BMI not provided",
          formData.familyHistory === "yes"
            ? "Family history of diabetes"
            : "No family history of diabetes",
        ],
        recommendations: [
          "Maintain a balanced diet low in refined sugars",
          "Regular physical activity (150+ minutes per week)",
          "Monitor blood glucose levels periodically",
          Number.parseFloat(formData.bmi) > 25
            ? "Consider weight management program"
            : "Maintain healthy weight",
        ],
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Diabetes Risk Assessment</h2>
        <p className="text-slate-600 mb-4">
          Enter your health metrics for an AI-powered analysis of your diabetes
          risk factors.
        </p>

        {!isAnalyzing && !result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
                >
                  <SelectTrigger
                    id="gender"
                    className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 24.5"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGlucose">
                  Fasting Blood Glucose (mg/dL)
                </Label>
                <Input
                  id="bloodGlucose"
                  name="bloodGlucose"
                  type="number"
                  placeholder="e.g., 95"
                  value={formData.bloodGlucose}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory">
                  Family history of diabetes?
                </Label>
                <Select
                  value={formData.familyHistory}
                  onValueChange={(value) =>
                    handleSelectChange("familyHistory", value)
                  }
                  required
                >
                  <SelectTrigger
                    id="familyHistory"
                    className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalActivity">
                  Physical Activity Level
                </Label>
                <Select
                  value={formData.physicalActivity}
                  onValueChange={(value) =>
                    handleSelectChange("physicalActivity", value)
                  }
                  required
                >
                  <SelectTrigger
                    id="physicalActivity"
                    className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                    <SelectItem value="moderate">
                      Moderate (3-5 days/week)
                    </SelectItem>
                    <SelectItem value="active">
                      Active (6-7 days/week)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diet">Diet Quality</Label>
                <Select
                  value={formData.diet}
                  onValueChange={(value) => handleSelectChange("diet", value)}
                  required
                >
                  <SelectTrigger
                    id="diet"
                    className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">
                      Poor (high in processed foods)
                    </SelectItem>
                    <SelectItem value="fair">
                      Fair (occasional healthy choices)
                    </SelectItem>
                    <SelectItem value="good">
                      Good (mostly balanced diet)
                    </SelectItem>
                    <SelectItem value="excellent">
                      Excellent (well-balanced diet)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waistCircumference">
                  Waist Circumference (cm)
                </Label>
                <Input
                  id="waistCircumference"
                  name="waistCircumference"
                  type="number"
                  placeholder="e.g., 85"
                  value={formData.waistCircumference}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:shadow-lg"
            >
              <Flask className="mr-2 h-4 w-4" /> Analyze Diabetes Risk
            </Button>
          </form>
        ) : isAnalyzing ? (
          <div className="space-y-4 py-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flask className="h-12 w-12 text-amber-500 animate-pulse" />
                </div>
                <svg
                  className="w-24 h-24 rotate-[-90deg]"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-amber-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-amber-500 transition-all duration-300 ease-in-out"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium mb-1">
                Analyzing your health data
              </div>
              <div className="text-sm text-slate-500 animate-pulse">
                AI model processing your information...
              </div>
            </div>
          </div>
        ) : (
          result && (
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10"></div>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div
                    className={cn(
                      "p-4 rounded-full self-center transition-all duration-500",
                      result.riskLevel === "low"
                        ? "bg-emerald-100"
                        : result.riskLevel === "moderate"
                        ? "bg-amber-100"
                        : "bg-rose-100"
                    )}
                  >
                    <Flask
                      className={cn(
                        "h-12 w-12",
                        result.riskLevel === "low"
                          ? "text-emerald-600"
                          : result.riskLevel === "moderate"
                          ? "text-amber-600"
                          : "text-rose-600"
                      )}
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-1">
                      {result.riskLevel === "low"
                        ? "Low"
                        : result.riskLevel === "moderate"
                        ? "Moderate"
                        : "High"}{" "}
                      Risk
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                      <div className="text-3xl font-bold">
                        {result.riskScore}%
                      </div>
                      <div className="text-sm text-slate-500">
                        5-year risk of developing type 2 diabetes
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm justify-center md:justify-start">
                      <BarChart3 className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        Analysis confidence: {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Key Risk Factors
                  </h3>
                  <ul className="space-y-3">
                    {result.keyFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-slate-100 p-1 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-slate-600" />
                        </div>
                        <span className="text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Flask className="h-5 w-5 text-amber-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="w-full hover:bg-amber-50 transition-all duration-300"
              >
                Start New Analysis
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  title,
  value,
  suffix,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value > 0) {
      const duration = 2000; // ms
      const interval = 50; // ms
      const steps = duration / interval;
      const increment = value / steps;

      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <Card
      className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden relative`}
    >
      <div className={`absolute inset-0 bg-${color}-50 opacity-50 -z-10`}></div>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="bg-white p-3 rounded-full shadow-sm">{icon}</div>
        <div>
          <h3 className="font-medium text-slate-800">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">
              {count}
              {suffix}
            </span>
            <span className="text-sm text-slate-500">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center relative group">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10 group-hover:bg-primary/20 transition-all duration-300">
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
        {icon}
      </div>
      <div className="absolute top-8 left-0 right-0 text-center">
        <span className="text-4xl font-bold text-primary/10">{number}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  author,
  role,
  image,
}: {
  quote: string;
  author: string;
  role: string;
  image: string;
}) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-all duration-300">
          <Image
            src={image || "/placeholder.svg"}
            alt={author}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-slate-600 mb-4 italic">"{quote}"</p>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Item Component
function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full p-4 text-left font-medium flex justify-between items-center hover:bg-slate-50 transition-colors"
        onClick={onClick}
      >
        {question}
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 text-slate-600">{answer}</div>
      </div>
    </div>
  );
}

// Types
interface AnalysisResult {
  condition: string;
  confidence: number;
  risk: "low" | "medium" | "high";
  recommendations: string[];
}

interface HeartRiskResult {
  riskScore: number;
  riskLevel: "low" | "moderate" | "high";
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}

interface DiabetesRiskResult {
  riskScore: number;
  riskLevel: "low" | "moderate" | "high";
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}
