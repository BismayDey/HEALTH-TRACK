"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Mail,
  CheckCircle,
  Stethoscope,
  Activity,
  Brain,
  Pill,
  Menu,
  X,
  Users,
  Clipboard,
  Microscope,
  User,
  LogOut,
  ArrowRightFromLine,
  Settings,
  ScrollText,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function HealthcareLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  return (
    <>
      <script id="kal" type="text/javascript">
        {`(function(w, d, s, o) {
    w.ChatbotWidget = o;
    var js = d.createElement(s);
    js.src = 'https://chatbuild.vercel.app/widget.min.js';
    js.async = 1;
    js.dataset.botId = 'z3gvNx1NGRinJSBJDGYW';
    d.getElementsByTagName('head')[0].appendChild(js);
  })(window, document, 'script', {});`}
      </script>
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-[#0284c7]" />
              <span className="text-xl font-bold text-[#0f172a]">
                Health Track
              </span>
            </div>
            <nav className="hidden md:flex gap-8">
              <Link
                href="#"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Home
              </Link>
              <Link
                href="#services"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Services
              </Link>
              <Link
                href="#doctors"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Doctors
              </Link>
              <Link
                href="#locations"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Locations
              </Link>
              <Link
                href="#contact"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 rounded-full overflow-hidden border border-gray-300 focus:outline-none"
                  >
                    <img
                      src={user?.photoURL || ""}
                      alt={user?.displayName || "User"}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <hr className="border-gray-200" />

                      <a
                        href="/profile"
                        className="px-4 py-2 text-sm hover:bg-gray-100 flex flex-nowrap items-center gap-2"
                      >
                        <Settings size={20} />
                        Profile Settings
                      </a>

                      <button
                        onClick={handleSignOut}
                        className="flex w-full px-4 py-2 items-center gap-2 text-sm text-red-600 hover:bg-gray-100 font-bold flex-nowrap"
                      >
                        <ArrowRightFromLine size={20} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="text-xl bg-[#0284c7] hover:bg-[#0369a1]"
                  size="sm"
                >
                  <Link href="/auth">
                    <User color="white" className="transform scale-150" />
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-[40px] w-[40px] -mr-[20px]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-[30px] w-[30px]" />
                ) : (
                  <Menu className="h-[30px] w-[30px]" />
                )}
              </Button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b">
              <nav className="flex flex-col p-4 space-y-3">
                <Link
                  href="#"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#services"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#doctors"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Doctors
                </Link>
                <Link
                  href="#locations"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Locations
                </Link>
                <Link
                  href="#contact"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Button
                  size="sm"
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white mt-2"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  1-800-HEALTH
                </Button>
              </nav>
            </div>
          )}
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-20 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe]">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                    Trusted Healthcare Provider
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-5xl xl:text-6xl/none">
                      Your Health Is Our{" "}
                      <span className="text-[#0284c7]">Top Priority</span>
                    </h1>
                    <p className="max-w-[600px] text-[#64748b] md:text-xl">
                      Providing compassionate care and cutting-edge medical
                      services to our community for over 25 years.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button
                      size="lg"
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white inline-flex items-center gap-2 shadow-sm font-bold"
                    >
                      Book an Appointment
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-[#0284c7] text-[#0284c7] group"
                    >
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                      <Clock className="h-4 w-4 text-[#0284c7]" />
                      <span className="text-[#334155]">
                        24/7 Emergency Care
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                      <CheckCircle className="h-4 w-4 text-[#0284c7]" />
                      <span className="text-[#334155]">Insurance Accepted</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0284c7]/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0284c7]/10 rounded-full blur-xl"></div>
                  <DotLottieReact
                    src="https://lottie.host/dbb9634e-fda1-4e7f-8118-de18aa7f3833/bI50uEmxYv.lottie"
                    autoplay
                    className="mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:aspect-square"
                    style={{ width: 550, height: 550 }}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-16 bg-white">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  {
                    value: "25+",
                    label: "Years of Experience",
                    icon: (
                      <Clock className="h-8 w-8 mx-auto mb-2 text-[#0284c7]" />
                    ),
                  },
                  {
                    value: "50,000+",
                    label: "Patients Served",
                    icon: (
                      <Users className="h-8 w-8 mx-auto mb-2 text-[#0284c7]" />
                    ),
                  },
                  {
                    value: "100+",
                    label: "Medical Specialists",
                    icon: (
                      <Stethoscope className="h-8 w-8 mx-auto mb-2 text-[#0284c7]" />
                    ),
                  },
                  {
                    value: "4",
                    label: "Locations",
                    icon: (
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-[#0284c7]" />
                    ),
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-6 bg-[#f8fafc] rounded-xl hover:shadow-md transition-all"
                  >
                    {stat.icon}
                    <h3 className="text-3xl font-bold text-[#0f172a]">
                      {stat.value}
                    </h3>
                    <p className="text-[#64748b]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="services"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Services
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Comprehensive Healthcare Solutions
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    We offer a wide range of medical services to meet the needs
                    of our diverse patient population.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <HeartPulse className="h-10 w-10 text-[#0284c7]" />,
                    title: "Primary Care",
                    description:
                      "Comprehensive healthcare services for patients of all ages, focusing on your overall health and wellness.",
                  },
                  {
                    icon: <Users className="h-10 w-10 text-[#0284c7]" />,
                    title: "Family Medicine",
                    description:
                      "Care for the entire family, from newborns to seniors, building lasting relationships with our patients.",
                  },
                  {
                    icon: <Calendar className="h-10 w-10 text-[#0284c7]" />,
                    title: "Preventive Care",
                    description:
                      "Regular check-ups and screenings to maintain your health and catch potential issues early.",
                  },
                  {
                    icon: <Brain className="h-10 w-10 text-[#0284c7]" />,
                    title: "Neurology",
                    description:
                      "Specialized care for conditions affecting the brain, spine, and nervous system.",
                  },
                  {
                    icon: <Activity className="h-10 w-10 text-[#0284c7]" />,
                    title: "Cardiology",
                    description:
                      "Expert care for heart conditions with the latest diagnostic and treatment technologies.",
                  },
                  {
                    icon: <Pill className="h-10 w-10 text-[#0284c7]" />,
                    title: "Pharmacy",
                    description:
                      "On-site pharmacy services for convenient access to your prescribed medications.",
                  },
                ].map((service, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden transition-all hover:shadow-md border-none bg-white"
                  >
                    <CardHeader className="p-6">
                      <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                        {service.icon}
                      </div>
                      <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <CardDescription className="text-base text-[#64748b]">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-[#0284c7] group-hover:text-[#0369a1] transition-colors"
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section
            id="ai-assistant"
            className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  AI-Powered Healthcare
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Meet Your Personal Health Assistant
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Our AI-powered health assistant provides personalized care,
                    monitoring, and support for your everyday health needs.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Daily Health Tracking */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                      <Activity className="h-6 w-6 text-[#0284c7]" />
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                      Daily Health Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      Monitor vital signs, activity levels, sleep patterns, and
                      nutrition with our AI-powered tracking system. Receive
                      personalized insights and recommendations.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#64748b]">
                            Heart Rate
                          </span>
                          <span className="text-sm font-medium text-[#0f172a]">
                            72 bpm
                          </span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                          <div
                            className="bg-[#0284c7] h-2 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#64748b]">
                            Sleep Quality
                          </span>
                          <span className="text-sm font-medium text-[#0f172a]">
                            Good
                          </span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                          <div
                            className="bg-[#0284c7] h-2 rounded-full"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dailyhealth"
                      className="w-full group border border-[#0284c7] text-[#0284c7] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
                    >
                      Try AI Diagnostics
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* AI-Powered Diagnostics */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                      <Microscope className="h-6 w-6 text-[#0284c7]" />
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                      AI-Powered Diagnostics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      Early detection of skin diseases, diabetes risk factors,
                      and heart conditions through our advanced AI diagnostic
                      tools. Upload images or input symptoms for analysis.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0f172a]">
                          Skin Analysis
                        </span>
                        <span className="text-xs text-[#64748b]">
                          98% accuracy rate
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0f172a]">
                          Heart Risk
                        </span>
                        <span className="text-xs text-[#64748b]">
                          95% accuracy rate
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0f172a]">
                          Diabetes
                        </span>
                        <span className="text-xs text-[#64748b]">
                          93% accuracy rate
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/diagnostics"
                      className="w-full group border border-[#0284c7] text-[#0284c7] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
                    >
                      Try AI Diagnostics
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* Mental Health Support */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                      <Brain className="h-6 w-6 text-[#0284c7]" />
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                      Mental Health Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      24/7 AI chat support for mental health concerns, stress
                      management, and emotional well-being. Get personalized
                      coping strategies and resources.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center shrink-0 text-white text-xs">
                          AI
                        </div>
                        <div className="bg-[#e0f2fe] rounded-lg p-2 text-sm text-[#0f172a]">
                          How are you feeling today? I'm here to listen and
                          help.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-[#f1f5f9] rounded-lg p-2 text-sm text-[#0f172a]">
                          I've been feeling anxious about work lately.
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center shrink-0 text-[#64748b] text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/AI"
                      className="w-full group border border-[#0284c7] text-[#0284c7] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
                    >
                      Chat with AI Support
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* Health Dashboard */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                      <Clipboard className="h-6 w-6 text-[#0284c7]" />
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                      Personalized Health Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      View all your health data in one place with personalized
                      insights, trends, and recommendations. Track progress and
                      set health goals.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">
                            Health Score
                          </div>
                          <div className="text-lg font-medium text-[#0f172a]">
                            85/100
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">
                            Risk Level
                          </div>
                          <div className="text-lg font-medium text-[#22c55e]">
                            Low
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">
                            Appointments
                          </div>
                          <div className="text-lg font-medium text-[#0f172a]">
                            2
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">
                            Medications
                          </div>
                          <div className="text-lg font-medium text-[#0f172a]">
                            3
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/healthdash"
                      className="w-full group border border-[#0284c7] text-[#0284c7] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
                    >
                      View Your Dashboard
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* Emergency Assistance */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-4 group-hover:bg-[#ef4444]/20 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-[#ef4444]"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#ef4444] transition-colors">
                      Emergency Assistance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      Quick access to emergency services, real-time guidance for
                      first aid, and community support during emergencies.
                      One-tap emergency contact.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0f172a]">
                          Emergency Features
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                          <span className="text-sm text-[#64748b]">
                            One-tap emergency call
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                          <span className="text-sm text-[#64748b]">
                            GPS location sharing
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                          <span className="text-sm text-[#64748b]">
                            First aid instructions
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/emergency"
                      className="w-full group border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition"
                    >
                      Emergency Services
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* Health Recommendations */}
                <Card className="group overflow-hidden transition-all hover:shadow-md border-none bg-white">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                      <Pill className="h-6 w-6 text-[#0284c7]" />
                    </div>
                    <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                      Tailored Health Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base text-[#64748b]">
                      Receive personalized health recommendations based on your
                      profile, health history, and current conditions. Get
                      nutrition, exercise, and lifestyle advice.
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-4">
                      <div className="space-y-3">
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">
                            Nutrition
                          </div>
                          <div className="text-sm text-[#0f172a]">
                            Increase omega-3 intake for heart health
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">Exercise</div>
                          <div className="text-sm text-[#0f172a]">
                            30 min moderate cardio, 3x weekly
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#e2e8f0]">
                          <div className="text-xs text-[#64748b]">Sleep</div>
                          <div className="text-sm text-[#0f172a]">
                            Aim for 7-8 hours of quality sleep
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/healthrecom"
                      className="w-full group border border-[#0284c7] text-[#0284c7] px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
                    >
                      Get Recommendations
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              </div>

              <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:shrink-0">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      width={300}
                      height={300}
                      alt="AI Health Assistant"
                      className="h-48 w-full object-cover md:h-full md:w-48"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-[#0284c7] font-semibold">
                      AI-Powered Healthcare
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-[#0f172a]">
                      Experience the Future of Healthcare Today
                    </h3>
                    <p className="mt-2 text-[#64748b]">
                      Our AI health assistant combines cutting-edge technology
                      with medical expertise to provide you with personalized
                      healthcare support. From daily health tracking to early
                      disease detection, mental health support, and emergency
                      assistance, we're here for you 24/7.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        HIPAA Compliant
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Data Encryption
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Medical-Grade Accuracy
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white">
                        Get Started with AI Health Assistant
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="doctors"
            className="w-full py-12 md:py-24 lg:py-32 bg-white"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Team
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Meet Our Doctors
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Our team of experienced healthcare professionals is
                    dedicated to providing you with the highest quality care.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Dr. Paggu",
                    specialty: "Family Medicine",
                    image: "/paggu.jpg",
                    education: "R.G. Kar Medical College and Hospital",
                  },
                  {
                    name: "Dr. Adi",
                    specialty: "Cardiology",
                    image: "/adi.jpg",
                    education: "Johns Hopkins University",
                  },
                  {
                    name: "Dr. Hansraj Hathi",
                    specialty: "Pediatrics",
                    image: "/hati.jpg",
                    education: "Stanford University",
                  },
                ].map((doctor, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden transition-all hover:shadow-md border-none bg-[#f8fafc]"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        width={300}
                        height={400}
                        className="w-full object-cover h-64 transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                        {doctor.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-[#64748b]">
                        {doctor.specialty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-normal text-[#64748b] border-[#cbd5e1]"
                        >
                          {doctor.education}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="group border-[#0284c7] text-[#0284c7]"
                >
                  View All Doctors
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </section>

          <section
            id="locations"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Locations
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Find Us Near You
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    With multiple locations across the city, quality healthcare
                    is always close by.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2">
                <div className="space-y-6">
                  {[
                    {
                      name: "Apollo Hospitals, Chennai",
                      address:
                        "21, Greams Lane, Off Greams Road, Chennai – 600006, India",
                      phone: "+91 44 4040 1066",
                      hours: "Open 24/7",
                    },
                    {
                      name: "Max Super Speciality Hospital, Saket",
                      address:
                        "12, Press Enclave Road, Saket Institutional Area, Saket, New Delhi – 110017, India",
                      phone: "011-26515050",
                      hours: "Open 24/7",
                    },
                    {
                      name: "Peerless Hospital, Kolkata",
                      address:
                        "360 Panchasayar, Kolkata – 700094, West Bengal, India",
                      phone: "+91 33 4011 1222",
                      hours: "Open 24/7",
                    },
                  ].map((location, index) => (
                    <Card
                      key={index}
                      className="group hover:shadow-md transition-all border-none bg-white"
                    >
                      <CardHeader>
                        <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                          {location.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.hours}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group border-[#0284c7] text-[#0284c7]"
                        >
                          Get Directions
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-md">
                  <Image
                    src="/map.png"
                    alt="Map of our locations"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white">
                      Find Nearest Location
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  FAQ
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Frequently Asked Questions
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Find answers to common questions about our services,
                    insurance, and appointments.
                  </p>
                </div>
              </div>
              <div className="mx-auto max-w-3xl mt-12">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "What insurance plans do you accept?",
                      answer:
                        "We accept most major insurance plans, including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact our office to verify your specific insurance coverage.",
                    },
                    {
                      question: "How do I schedule an appointment?",
                      answer:
                        "You can schedule an appointment by calling our office, using our online booking system on this website, or through our patient portal. We offer same-day appointments for urgent needs.",
                    },
                    {
                      question: "What should I bring to my first appointment?",
                      answer:
                        "Please bring your insurance card, photo ID, list of current medications, medical records if available, and any referral forms if required by your insurance. Arriving 15 minutes early to complete paperwork is recommended.",
                    },
                    {
                      question: "Do you offer telehealth services?",
                      answer:
                        "Yes, we offer telehealth services for many types of appointments. These virtual visits allow you to consult with your healthcare provider from the comfort of your home for follow-ups, medication management, and certain conditions.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-[#e2e8f0]"
                    >
                      <AccordionTrigger className="text-left font-medium text-[#0f172a] hover:text-[#0284c7] transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#64748b]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Contact Us
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] md:text-4xl">
                    Ready to prioritize your health?
                  </h2>
                  <p className="max-w-[600px] text-[#64748b] md:text-lg">
                    Schedule an appointment today and take the first step
                    towards better health.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">Phone</h3>
                      <p className="text-[#64748b]">+91 33 4011 1222</p>
                      <p className="text-sm text-[#64748b]">
                        Available 24/7 for emergencies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">Email</h3>
                      <p className="text-[#64748b]">info@medicare.com</p>
                      <p className="text-sm text-[#64748b]">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">
                        Main Location
                      </h3>
                      <p className="text-[#64748b]">
                        360 Panchasayar, Kolkata – 700094, West Bengal, India
                      </p>
                      <p className="text-sm text-[#64748b]">Open 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="shadow-md border-none bg-white">
                <CardHeader>
                  <CardTitle className="text-[#0f172a]">
                    Book an Appointment
                  </CardTitle>
                  <CardDescription className="text-[#64748b]">
                    Fill out the form below and we'll contact you to confirm
                    your appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium text-[#0f172a]"
                      >
                        First Name
                      </label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="border-[#e2e8f0]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium text-[#0f172a]"
                      >
                        Last Name
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="border-[#e2e8f0]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="border-[#e2e8f0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="border-[#e2e8f0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Service
                    </label>
                    <Select>
                      <SelectTrigger className="border-[#e2e8f0]">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary-care">
                          Primary Care
                        </SelectItem>
                        <SelectItem value="family-medicine">
                          Family Medicine
                        </SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your symptoms or reason for visit..."
                      className="border-[#e2e8f0]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white">
                    Submit Request
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </main>
        <footer className="w-full border-t bg-white">
          <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between md:py-12">
            <div className="flex flex-col gap-2 max-w-xs">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-[#0284c7]" />
                <span className="text-xl font-bold text-[#0f172a]">
                  Health Track
                </span>
              </div>
              <p className="text-sm text-[#64748b]">
                Providing quality healthcare services since 1998. Our mission is
                to deliver compassionate care and improve the health of our
                community.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Services</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Primary Care
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Family Medicine
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Pediatrics
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Cardiology
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Company</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Our Doctors
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Contact
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Legal</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Patient Rights
                </Link>
              </div>
            </nav>
          </div>
          <div className="border-t border-[#e2e8f0] py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-[#64748b] md:text-left">
                © {new Date().getFullYear()} MediCare. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
