"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import axios from "axios";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Phone,
  Settings,
  Volume2,
  User,
  Building2,
  ChevronDown,
  ChevronUp,
  Shield,
  Webhook,
  PhoneForwarded,
  BookOpen,
  Save,
} from "lucide-react";
import { getRetellVoices } from "@/Services/auth";


interface Agent {
  agent_id: string;
  agentName: string;
  agentVoice: string;
  agentAccent: string;
  agentRole: string;
  agentLanguageCode: string;
  agentLanguage: string;
  agentGender: string;
  llmId: string;
  voice_id?: string;
  language?: string;
  modelName?: string;
  phone?: string;
  status: "Online" | "Offline" | "Busy";
  callsHandled: number;
  avgResponseTime: string;
  avatar?: string;
  rawPromptTemplate?: string;
  dynamicPromptTemplate?: string;
  llmDetails?: { model?: string };
}

interface Business {
  id: number;
  businessName: string;
  userName: string;
  userEmail?: string;
  industry?: string;
  agents?: Agent[];
  totalCalls?: number;
  activeAgents?: number;
}

interface BusinessType {
  type: string
  subtype: string
  icon: string
}

const allBusinessTypes = [
    {
      type: "Real Estate Broker",
      subtype: "Property Transaction Facilitator",
      icon: "svg/Estate-icon.svg",
    },
    {
      type: "Restaurant",
      subtype: "Food Service Establishment",
      icon: "svg/Landscaping-icon.svg",
    },
    {
      type: "Interior Designer",
      subtype: "Indoor Space Beautifier",
      icon: "svg/Interior-Designer-icon.svg",
    },
    {
      type: "Saloon",
      subtype: "Hair Styling & Grooming",
      icon: "svg/Saloon-icon.svg",
    },
    {
      type: "Landscaping Company",
      subtype: "Outdoor Space Beautification",
      icon: "svg/Landscaping-icon.svg",
    },
    {
      type: "Dentist",
      subtype: "Dental Care Provider",
      icon: "svg/Dentist-Office-icon.svg",
    },
    {
      type: "Doctor's Clinic",
      subtype: "Medical Consultation & Treatment",
      icon: "svg/Doctor-clinic-icon.svg",
    },
    {
      type: "Gym & Fitness Center",
      subtype: "Exercise Facility & Training",
      icon: "svg/Gym-icon.svg",
    },

    {
      type: "Personal Trainer",
      subtype: "Individual Fitness Coaching",
      icon: "svg/Personal-Trainer-icon.svg",
    },
    {
      type: "Web Design Agency",
      subtype: "Website Creation & Development",
      icon: "svg/Web-Design-Agency-icon.svg",
    },
    {
      type: "Architect",
      subtype: "Building Design Expert",
      icon: "svg/Architect-icon.svg",
    },
    {
      type: "Property Rental & Leasing Service",
      subtype: "Property Rental Management",
      icon: "svg/Property Rental & Leasing Service.svg",
    },
    {
      type: "Construction Services",
      subtype: "Building Construction & Repair",
      icon: "svg/Construction Services.svg",
    },
    {
      type: "Insurance Agency",
      subtype: "Risk Protection Provider",
      icon: "svg/Insurance Agency.svg",
    },
    {
      type: "Old Age Home",
      subtype: "Senior Living Facility",
      icon: "svg/Old Age Home.svg",
    },
    {
      type: "Travel Agency",
      subtype: "Trip Planning & Booking",
      icon: "svg/Travel Agency.svg",
    },
    {
      type: "Ticket Booking",
      subtype: "Travel Ticket Provider",
      icon: "svg/Ticket Booking.svg",
    },
    {
      type: "Accounting Services",
      subtype: "Financial Record Management",
      icon: "svg/Accounting Services.svg",
    },
    {
      type: "Financial Planners",
      subtype: "Wealth Management Advice",
      icon: "svg/Financial Planners.svg",
    },
    {
      type: "Beauty Parlour",
      subtype: "Cosmetic Beauty Services",
      icon: "svg/Beauty Parlour.svg",
    },
    {
      type: "Nail Salon",
      subtype: "Manicure/Pedicure Services",
      icon: "svg/Nail Saloon.svg",
    },
    {
      type: "Barber Studio/Shop",
      subtype: "Men's Hair Grooming",
      icon: "svg/Barber.svg",
    },
    {
      type: "Hair Stylist",
      subtype: "Professional Hair Care",
      icon: "svg/Hair Stylist.svg",
    },
    {
      type: "Bakery",
      subtype: "Baked Goods Producer",
      icon: "svg/Bakery.svg",
    },
    {
      type: "Dry Cleaner",
      subtype: "Garment Cleaning & Care",
      icon: "svg/Dry Cleaner.svg",
    },
    {
      type: "Cleaning Janitorial Service",
      subtype: "Professional Cleaning Solutions",
      icon: "svg/Cleaning Janitorial Service.svg",
    },
    // {
    //   type: "Marketing Agency",
    //   subtype: "Your Journey Begins Here",
    //   icon: "svg/Marketing Agency.svg",
    // },


    {
      type: "Other",
      subtype: "More Ideas, More Impact",
      icon: "svg/Web-Design-Agency-icon.svg",
    }
  ];
  const avatars = {
  Male: [
    { img: '/images/Male-01.png' },
    { img: '/images/Male-02.png' },
    { img: '/images/Male-03.png' },
    { img: '/images/Male-04.png' },
    { img: '/images/Male-05.png' },
  ],
  Female: [
    { img: '/images/Female-01.png' },
    { img: '/images/Female-02.png' },
    { img: '/images/Female-03.png' },
    { img: '/images/Female-04.png' },
    { img: '/images/Female-05.png' },
    { img: '/images/Female-06.png' },
  ],
};


const businessServices = [
    {
      type: "Restaurant",
      subtype: "Food Service Establishment",
      icon: "svg/Restaurant-icon.svg",
      services: [
        "Dine-in Service",
        "Takeaway Orders",
        "Home Delivery",
        "Event Catering",
        "Online Ordering",
        "Other"
      ],
    },
    {
      type: "Real Estate Broker",
      subtype: "Property Transaction Facilitator",
      icon: "svg/Estate-icon.svg",
      services: [
        "Property Sales",
        "Property Rentals",
        "Property Viewings",
        "Price Valuation",
        "Legal Help",
        "Other"
      ],
    },
    {
      type: "Saloon",
      subtype: "Hair Styling & Grooming",
      icon: "svg/Saloon-icon.svg",
      services: [
        "Haircuts",
        "Hair Spa Treatments",
        "Hair Straightening",
        "Nail Extensions",
        "Facials",
        "Other"
      ],
    },
    {
      type: "Doctor's Clinic",
      subtype: "Medical Consultation & Treatment",
      icon: "svg/Doctor-clinic-icon.svg",
      services: [
        "General Checkups",
        "Specialist Consultations",
        "Vaccinations",
        "Blood Tests",
        "Health Screenings",
        "Other"
      ],
    },
    {
      type: "Dry Cleaner",
      subtype: "Garment Cleaning & Care",
      icon: "svg/Dry -Cleaner-icon.svg",
      services: [
        "Garment Cleaning",
        "Stain Removal",
        "Clothing Alterations",
        "Leather & Suede Cleaning",
        "Other"
      ],
    },
    {
      type: "Web Design Agency",
      subtype: "Website Creation & Development",
      icon: "svg/Web-Design-Agency-icon.svg",
      services: [
        "Website Creation",
        "Responsive Design",
        "SEO Services",
        "Website Maintenance",
        "E-commerce Setup",
        "Other"
      ],
    },
    {
      type: "Gym & Fitness Center",
      subtype: "Exercise Facility & Training",
      icon: "svg/Gym-icon.svg",
      services: [
        "Group Fitness Classes",
        "Weight Training Equipment",
        "Cardio Workouts",
        "Personal Training Sessions",
        "Other"
      ],
    },
    {
      type: "Marketing Agency",
      subtype: "Business Promotion Strategies",
      icon: "svg/Marketing Agency.svg",
      services: [
        "Social Media Advertising",
        "Content Creation",
        "Email Marketing",
        "PPC Ads",
        "Branding Strategy",
        "Other"
      ],
    },
    {
      type: "Personal Trainer",
      subtype: "Individual Fitness Coaching",
      icon: "images/other.png",
      services: [
        "Personalized Workout Plans",
        "One-on-One Training",
        "Nutrition Guidance",
        "Fitness Assessments",
        "Other"
      ],
    },
    {
      type: "Architect",
      subtype: "Building Design Expert",
      icon: "svg/Architect-icon.svg",
      services: [
        "Residential Building Design",
        "Commercial Building Plans",
        "Renovation Planning",
        "Permit Drawings",
        "Site Planning",
        "Project Management",
        "Other"
      ],
    },
    {
      type: "Interior Designer",
      subtype: "Indoor Space Beautifier",
      icon: "images/other.png",
      services: [
        "Space Planning",
        "Furniture Selection",
        "Color Consultation",
        "Lighting Design",
        "Home Makeovers",
        "Other"
      ],
    },
    {
      type: "Construction Services",
      subtype: "Building Construction & Repair",
      icon: "svg/Construction Services.svg",
      services: [
        "New Building Construction",
        "Home Renovations",
        "Project Supervision",
        "Structural Repairs",
        "Other"
      ],
    },
    {
      type: "Cleaning/Janitorial Service",
      subtype: "Building Construction & Repair",
      icon: "images/other.png",
      services: [
        "Office Cleaning",
        "Deep Carpet Cleaning",
        "Window Washing",
        "Floor Polishing",
        "Regular Maintenance",
        "Other"
      ],
    },
    {
      type: "Transport Company",
      subtype: "Freight Transportation Services",
      icon: "images/other.png",
      services: [
        "Freight Shipping",
        "Passenger Transport",
        "Courier Services",
        "Vehicle Rentals",
        "Logistics Management",
        "Other"
      ],
    },
    {
      type: "Landscaping Company",
      subtype: "Outdoor Space Beautification",
      icon: "images/other.png",
      services: [
        "Lawn Mowing & Maintenance",
        "Garden Design",
        "Tree Pruning & Removal",
        "Irrigation Installation",
        "Other"
      ],
    },
    {
      type: "Insurance Agency",
      subtype: "Risk Protection Provider",
      icon: "svg/Insurance Agency.svg",
      services: [
        "Life Insurance",
        "Health Insurance",
        "Car Insurance",
        "Home Insurance",
        "Business Insurance",
        "Other"
      ],
    },
    {
      type: "Financial Services",
      subtype: "Wealth Management Advice",
      icon: "images/other.png",
      services: [
        "Investment Planning",
        "Tax Preparation",
        "Retirement Planning",
        "Wealth Management",
        "Loan Consulting",
        "Other"
      ],
    },
    {
      type: "Accounting Services",
      subtype: "Financial Record Management",
      icon: "svg/Accounting Services.svg",
      services: [
        "Bookkeeping",
        "Tax Filing",
        "Payroll Services",
        "Financial Auditing",
        "Business Financial Reports",
        "Other"
      ],
    },
    {
      type: "Car Repair & Garage",
      subtype: "Vehicle Maintenance & Repair",
      icon: "images/other.png",
      services: [
        "Oil & Filter Change",
        "Brake Repairs",
        "Engine Diagnostics",
        "Tire Replacement",
        "Battery Service",
        "Other"
      ],
    },
    {
      type: "Boat Repair & Maintenance",
      subtype: "Watercraft Upkeep & Repair",
      icon: "images/other.png",
      services: [
        "Hull Repair",
        "Engine Maintenance",
        "Electrical System Repairs",
        "Boat Cleaning",
        "Winterizing Services",
        "Other"
      ],
    },
    {
      type: "Dentist",
      subtype: "Dental Care Provider",
      icon: "images/other.png",
      services: [
        "Teeth",
        "Cleaning",
        "Teeth Whitening",
        "Braces & Aligners",
        "Root Canal",
        "Tooth Extraction",
        "Other"
      ],
    },
    {
      type: "Property Rental & Leasing Service",
      subtype: "Property Rental Management",
      icon: "svg/Property Rental & Leasing Service.svg",
      services: [
        "Tenant Screening",
        "Lease Agreement Preparation",
        "Rent Collection",
        "Property Maintenance Coordination",
        "Other"
      ],
    },
    {
      type: "Old Age Home",
      subtype: "Senior Living Facility",
      icon: "svg/Old Age Home.svg",
      services: [
        "Assisted Living",
        "Meal Services",
        "Housekeeping & Laundry",
        "Recreational Activities",
        "Physiotherapy",
        "Emergency Support",
        "Other"
      ],
    },
    {
      type: "Travel Agency",
      subtype: "Trip Planning & Booking",
      icon: "svg/Travel Agency.svg",
      services: [
        "Flight Booking",
        "Hotel Reservations",
        "Holiday Packages",
        "Visa Assistance",
        "Travel Insurance",
        "Customized Itineraries",
        "Cruise Bookings",
        "Local Tours & Sightseeing",
        "Car Rentals",
        "Other"
      ],
    },
    {
      type: "Ticket Booking",
      subtype: "Travel Ticket Provider",
      icon: "svg/Ticket Booking.svg",
      services: [
        "Flight Tickets",
        "Train Tickets",
        "Bus Tickets",
        "Movie Tickets",
        "Event Tickets",
        "Amusement Park Tickets",
        "Concert & Show Tickets",
        "Sports Tickets",
        "Other"
      ],
    }
    ,
    {
      type: "Financial Planners",
      subtype: "Wealth Management Advice",
      icon: "svg/Financial Planners.svg",
      services: [
        "Retirement Planning",
        "Investment Portfolio Management",
        "Tax Planning",
        "Budgeting & Expense Management",
        "Estate Planning",
        "Insurance Planning",
        "Education Planning",
        "Debt Management",
        "Other"
      ],
    },
    {
      type: "Beauty Parlour",
      subtype: "Cosmetic Beauty Services",
      icon: "svg/Beauty Parlour.svg",
      services: [
        "Hair Cutting & Styling",
        "Facials & Cleanups",
        "Manicure & Pedicure",
        "Bridal Makeup",
        "Hair Coloring & Highlights",
        "Waxing & Threading",
        "Skin Treatments",
        "Makeup for Events",
        "Spa & Massage Services",
        "Other"
      ],
    },
    {
      type: "Nail Salon",
      subtype: "Manicure/Pedicure Services",
      icon: "svg/Nail Saloon.svg",
      services: [
        "Manicure",
        "Pedicure",
        "Nail Art",
        "Gel Nails",
        "Acrylic Nails",
        "Nail Extensions",
        "Cuticle Care",
        "Nail Repair & Removal",
        "Hand & Foot Spa",
        "Other"
      ],
    }
    ,
    {
      type: "Barber Studio/Shop",
      subtype: "Men's Hair Grooming",
      icon: "svg/Barber.svg",
      services: [
        "Haircut",
        "Beard Trimming & Styling",
        "Shaving & Grooming",
        "Hair Coloring",
        "Head Massage",
        "Facial for Men",
        "Scalp Treatment",
        "Hair Wash & Styling",
        "Kids Haircut",
        "Other"
      ],
    }
    ,
    {
      type: "Hair Stylist",
      subtype: "Professional Hair Care",
      icon: "svg/Hair Stylist.svg",
      services: [
        "Hair Cutting & Trimming",
        "Hair Styling",
        "Blow Dry & Ironing",
        "Hair Coloring & Highlights",
        "Hair Spa",
        "Keratin & Smoothening Treatments",
        "Hair Extensions",
        "Scalp Treatments",
        "Bridal & Occasion Hairstyles",
        "Other"
      ],
    }
    ,
    {
      type: "Bakery",
      subtype: "Baked Goods Producer",
      icon: "svg/Bakery.svg",
      services: [
        "Custom Cakes",
        "Birthday & Wedding Cakes",
        "Pastries & Cupcakes",
        "Cookies & Biscuits",
        "Bread & Buns",
        "Chocolates & Desserts",
        "Eggless & Sugar-Free Items",
        "Bulk & Party Orders",
        "Online Ordering & Delivery",
        "Other"
      ],
    },
    {
      type: "Cleaning Janitorial Service",
      subtype: "Professional Cleaning Solutions",
      icon: "svg/Cleaning Janitorial Service.svg",
      services: [
        "Residential Cleaning",
        "Commercial Office Cleaning",
        "Deep Cleaning Services",
        "Move-In/Move-Out Cleaning",
        "Carpet & Upholstery Cleaning",
        "Window Cleaning",
        "Disinfection & Sanitization",
        "Post-Construction Cleaning",
        "Restroom Cleaning & Maintenance",
        "Other"
      ],
    }



]

interface AgentDetailViewProps {
  agent: Agent;
  business: Business;
  total_call:total_call,
  onBack: () => void;
  agentName: string;
  dropdowns?: Record<string, boolean>;
  toggleDropdown: (key: string) => void;
  setShowAgentModal: (show: boolean) => void;
  setAgentData: React.Dispatch<React.SetStateAction<any>>;
  languages: { locale: string; name: string }[];
}

const modelList = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "claude-3.7-sonnet",
  "claude-3.5-haiku",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const getModelImage = (model: string) => {
  const modelLower = model.toLowerCase();
  if (modelLower.includes("gpt")) return "/images/ChatGPT-Logo.png";
  if (modelLower.includes("gemini")) return "/images/geminiis.png";
  if (modelLower.includes("claude")) return "/images/claude.png";
  return "/images/default.png";
};

const sidebarOptions = [
  { id: "functions", label: "Functions", icon: Settings, hasDropdown: true },
  {
    id: "knowledge",
    label: "Knowledge Base",
    icon: BookOpen,
hasDropdown: true, 
  },
  { id: "speech", label: "Speech Settings", icon: Volume2, hasDropdown: false },
  { id: "call", label: "Call Settings", icon: Phone, hasDropdown: true },
  {
    id: "forwards",
    label: "Text-Call Forwards",
    icon: PhoneForwarded,
    hasDropdown: false,
  },
  {
    id: "security",
    label: "Security & Callback Settings",
    icon: Shield,
    hasDropdown: true,
  },
  {
    id: "webhook",
    label: "Webhook Settings",
    icon: Webhook,
    hasDropdown: false,
  },
];

export function AgentDetailView({
  agent,
  business,
  knowledge_base_texts,
  total_call,
  onBack,
  agentName,
  dropdowns = {},
  toggleDropdown,
  setShowAgentModal,
  setAgentData,
  languages,
}: AgentDetailViewProps) {
  const [activeTab, setActiveTab] = useState("functions");
  const [retellVoices, setRetellVoices] = useState<any[]>([]);
  const [isDynamicView, setIsDynamicView] = useState(false);
  const [prompt, setPrompt] = useState(agent.rawPromptTemplate || "");
  const dynamicPrompt = agent.dynamicPromptTemplate || "";
  const [modelName, setModelName] = useState(agent.modelName || "gemini-2.0-flash");
  const [selectedVoiceId, setSelectedVoiceId] = useState(agent.voice_id || "");
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([
  "Sales Docs",
  "Product Training",
]);
  const [businessSearch, setBusinessSearch] = useState("")
   const [businessSize, setBusinessSize] = useState("");
 const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(allBusinessTypes)
  const [allServices, setAllServices] = useState<{ [key: string]: string[] }>({})
  const [selectedType, setSelectedType] = useState("")
  const [newBusinessType, setNewBusinessType] = useState("")
  const [newService, setNewService] = useState("")
const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
 const [form, setForm] = useState<any>({})
const [newKnowledgeName, setNewKnowledgeName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    agent.language || ""
  );
console.log(knowledge_base_texts,"knowledge_base_texts")
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const data = await getRetellVoices();
        setRetellVoices(data);
      } catch (error) {
        console.error("Failed to fetch voices", error);
      }
    };
    fetchVoices();
  }, []);
  const URL = "https://rex-bk.truet.net";
  const getStatusBadge = (status: Agent["status"]) => {
    const variants = {
      Online: "bg-green-100 text-green-800",
      Offline: "bg-gray-100 text-gray-800",
      Busy: "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="h-screen w-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agent List
          </Button>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <img src={agent.avatar} className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {agent?.agentName || "NA"}
                  </h3>
                  {getStatusBadge(agent?.status)}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{business?.businessName || "NA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{business?.userName || "NA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{agent?.phone || "NA"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <nav className="flex-1 p-4 space-y-1">
         {sidebarOptions.map((opt) => {
  const Icon = opt.icon;
  const isActive = activeTab === opt.id;
  const isDropdownOpen = dropdowns[opt.id];

  return (
    <div key={opt.id}>
      <button
        onClick={() => {
          setActiveTab(opt.id);
          if (opt.hasDropdown) toggleDropdown(opt.id);
        }}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all ${
          isActive
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span>{opt.label}</span>
        </div>
        {opt.hasDropdown && (
          isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Knowledge Base Dropdown Items */}
      {opt.id === "knowledge" && isDropdownOpen && (
        <div className="ml-8 mt-2 space-y-2">
          {knowledgeBases.map((kb, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{agent.knowledgeBaseId}</span>
              <button
                className="text-red-500 text-xs"
                onClick={() => {
                  setKnowledgeBases(prev => prev.filter(name => name !== kb));
                }}
              >
              <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setShowAddKnowledgeModal(true)}
            className="text-blue-600 text-sm underline mt-2"
          >
            + Add New
          </button>
        </div>
      )}
    </div>
  );
})}

        </nav>

        <div className="p-4 border-t bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Performance Stats
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {total_call ?? 0}
              </div>
              <div className="text-xs text-gray-500">Total Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {agent.avgResponseTime || "NA"}
              </div>
              <div className="text-xs text-gray-500">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-lg font-bold">{agent.agentName}</h1>
          <h2 className="text-gray-600">LLMID: {agent.llmId}</h2>
        </div>

        {/* Model, Voice, Language Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Model Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 border rounded px-3 py-1 text-sm bg-white shadow-sm"
              onClick={() => toggleDropdown("model")}
            >
              <img
                src={getModelImage(modelName)}
                alt="model"
                className="w-5 h-5 rounded-full"
              />
              <span>{modelName}</span>
              {dropdowns?.model ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {dropdowns?.model && (
              <div className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
                {modelList.map((model) => (
                  <div
                    key={model}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      setModelName(model);
                      setAgentData((prev) => ({
                        ...prev,
                        modelName: model,
                        llmDetails: { ...prev.llmDetails, model },
                      }));
                      toggleDropdown("model");
                    }}
                  >
                    <img
                      src={getModelImage(model)}
                      alt={model}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm">{model}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 border rounded px-3 py-1 text-sm bg-white shadow-sm"
              onClick={() => toggleDropdown("agent")}
            >
              <img
                src={
                  retellVoices.find((v) => v.voice_id === selectedVoiceId)
                    ?.avatar_url || "https://csspicker.dev/api/image/?q=avatar"
                }
                alt="voice"
                className="w-5 h-5 rounded-full"
              />
              <span>
                {retellVoices.find((v) => v.voice_id === selectedVoiceId)
                  ?.voice_name || "Select Voice"}
              </span>
              {dropdowns?.agent ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {dropdowns?.agent && (
              <div className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
                {retellVoices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedVoiceId(voice.voice_id);
                      setAgentData((prev) => ({
                        ...prev,
                        voice_id: voice.voice_id,
                      }));
                      toggleDropdown("agent");
                    }}
                  >
                    <img
                      src={voice.avatar_url}
                      alt={voice.voice_name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm">{voice.voice_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 border rounded px-3 py-1 text-sm bg-white shadow-sm"
              onClick={() => toggleDropdown("language")}
            >
              <span>
                {Array.isArray(languages)
                  ? languages.find((l) => l.locale === selectedLanguage)
                      ?.name || "Select Language"
                  : "Select Language"}
              </span>
              {dropdowns?.language ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {dropdowns?.language && (
              <div className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <div
                    key={lang.locale}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setSelectedLanguage(lang.locale);
                      setAgentData((prev) => ({
                        ...prev,
                        language: lang.locale,
                      }));
                      toggleDropdown("language");
                    }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prompt Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">AI Agent Prompt</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDynamicView((prev) => !prev)}
            title={isDynamicView ? "Show Raw Prompt" : "Show Dynamic Prompt"}
          >
            {isDynamicView ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </Button>
        </div>

        <Textarea
          value={isDynamicView ? dynamicPrompt : prompt}
          onChange={(e) => {
            if (!isDynamicView) setPrompt(e.target.value);
          }}
          readOnly={isDynamicView}
          className="min-h-[300px] text-sm font-mono"
          placeholder="Enter system prompt here..."
        />

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Characters: {(isDynamicView ? dynamicPrompt : prompt).length}
          </span>
          <div className="space-x-2">
            <Button variant="outline" disabled={isDynamicView}>
              Reset
            </Button>
            <Button
  onClick={async () => {
    try {
      await axios.put(`${URL}/api/agent/llmprompt/update/${agent.llmId}`, {llmId:agent.llmId, prompt });
      alert("Prompt saved!");
    } catch (err) {
      console.error("Failed to save prompt:", err);
      alert("Save failed");
    }
  }}
>
  Save Prompt
</Button>
          </div>
        </div>
        {showAddKnowledgeModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Add Knowledge Base</h3>

      {/* Knowledge Base Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Knowledge Base Name</label>
        <Input
          value={newKnowledgeName}
          onChange={(e) => setNewKnowledgeName(e.target.value)}
          placeholder="Enter knowledge base name"
        />
      </div>

      {/* Business Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Business Type</label>
        <Select
          onValueChange={(val) => {
            if (val === "Other") {
              setSelectedType("Other");
              setForm((prev) => ({
                ...prev,
                businessType: "",
                businessSubtype: "",
                businessIcon: "",
                services: [],
                customBuisness: "",
              }));
            } else {
              const selected = businessTypes.find((b) => b.type === val);
              setSelectedType(val);
              setForm((prev) => ({
                ...prev,
                businessType: val,
                businessSubtype: selected?.subtype || "",
                businessIcon: selected?.icon || "",
                services: [],
                customBuisness: "",
              }));
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Search business..."
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                className="mb-2"
              />
            </div>

            {businessTypes
              .filter((b) =>
                `${b.type} ${b.subtype}`.toLowerCase().includes(businessSearch.toLowerCase())
              )
              .map((b) => (
                <SelectItem key={b.type} value={b.type}>
                  {b.type} - {b.subtype}
                </SelectItem>
              ))}
            {!businessTypes.some((b) => b.type.toLowerCase() === "other") && (
              <SelectItem value="Other">Other</SelectItem>
            )}
          </SelectContent>
        </Select>

        {selectedType === "Other" && (
          <Input
            placeholder="Add new business type"
            value={newBusinessType}
            onChange={(e) => setNewBusinessType(e.target.value)}
            onBlur={() => {
              if (
                newBusinessType &&
                !businessTypes.some(
                  (b) => b.type.toLowerCase() === newBusinessType.toLowerCase()
                )
              ) {
                const newBusiness = {
                  type: newBusinessType,
                  subtype: "Custom",
                  icon: "svg/Web-Design-Agency-icon.svg",
                };
                setBusinessTypes((prev) => [...prev, newBusiness]);
                setForm((prev) => ({
                  ...prev,
                  businessType: newBusinessType,
                  businessSubtype: "Custom",
                  businessIcon: newBusiness.icon,
                }));
              }
              setNewBusinessType("");
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Business Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Business Size</label>
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={businessSize}
          onChange={(e) => setBusinessSize(e.target.value)}
        >
          <option value="" disabled>Select Business Size</option>
          <option value="1 to 10 employees">1 to 10 employees</option>
          <option value="10 to 50 employees">10 to 50 employees</option>
          <option value="50 to 100 employees">50 to 100 employees</option>
          <option value="100 to 250 employees">100 to 250 employees</option>
          <option value="250 to 500 employees">250 to 500 employees</option>
          <option value="500 to 1000 employees">500 to 1000 employees</option>
          <option value="1000+ employees">1000+ employees</option>
        </select>
      </div>

      {/* Services */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Select Services</label>
        {(allServices[selectedType] || []).map((service) => (
          <div key={service} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.services?.includes(service)}
              onChange={() => {
                const current = form.services || [];
                const updated = current.includes(service)
                  ? current.filter((s) => s !== service)
                  : [...current, service];
                setForm((prev) => ({ ...prev, services: updated }));
              }}
            />
            <span>{service}</span>
          </div>
        ))}

        {!((allServices[selectedType] || []).includes("Other")) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.services?.includes("Other")}
              onChange={() => {
                const current = form.services || [];
                const updated = current.includes("Other")
                  ? current.filter((s) => s !== "Other")
                  : [...current, "Other"];
                setForm((prev) => ({ ...prev, services: updated }));
              }}
            />
            <span>Other</span>
          </div>
        )}

        {form.services?.includes("Other") && (
          <Input
            placeholder="Add new service"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onBlur={() => {
              if (
                newService &&
                !(allServices[selectedType] || []).includes(newService)
              ) {
                const updatedServices = [...(allServices[selectedType] || []), newService];
                setAllServices((prev) => ({
                  ...prev,
                  [selectedType]: updatedServices,
                }));

                const updatedFormServices = [
                  ...(form.services || []).filter((s) => s !== "Other"),
                  newService,
                ];
                setForm((prev) => ({
                  ...prev,
                  services: updatedFormServices,
                  customServices: [...(prev.customServices || []), newService],
                }));
              }
              setNewService("");
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="ghost"
          onClick={() => {
            setShowAddKnowledgeModal(false);
            setNewKnowledgeName("");
            // Reset form fields if needed
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            const payload = {
              knowledgeBaseName: newKnowledgeName,
              businessType: form.businessType || "Other",
              businessSize: businessSize || "",
              services: form.services || [],
              customServices: form.customServices || [],
            };

            try {
              // await axios.post(`${URL}/api/knowledgebase/create`, payload);
              setKnowledgeBases(prev => [...prev, newKnowledgeName.trim()]);
              setShowAddKnowledgeModal(false);
              setNewKnowledgeName("");
            } catch (err) {
              console.error("Failed to create knowledge base", err);
            }
          }}
        >
          Add Knowledge Base
        </Button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
