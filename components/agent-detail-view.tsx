"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { getRetellVoices, validateWebsite } from "@/Services/auth";
import Swal from "sweetalert2";

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
  type: string;
  subtype: string;
  icon: string;
}

const avatars = {
  Male: [
    { img: "/images/Male-01.png" },
    { img: "/images/Male-02.png" },
    { img: "/images/Male-03.png" },
    { img: "/images/Male-04.png" },
    { img: "/images/Male-05.png" },
  ],
  Female: [
    { img: "/images/Female-01.png" },
    { img: "/images/Female-02.png" },
    { img: "/images/Female-03.png" },
    { img: "/images/Female-04.png" },
    { img: "/images/Female-05.png" },
    { img: "/images/Female-06.png" },
  ],
};

interface AgentDetailViewProps {
  agent: Agent;
  business: Business;
  total_call: total_call;
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
  // { id: "functions", label: "Functions", icon: Settings, hasDropdown: true },
  {
    id: "knowledge",
    label: "Knowledge Base",
    icon: BookOpen,
    hasDropdown: true,
  },
  // { id: "speech", label: "Speech Settings", icon: Volume2, hasDropdown: false },
  // { id: "call", label: "Call Settings", icon: Phone, hasDropdown: true },
  // {
  //   id: "forwards",
  //   label: "Text-Call Forwards",
  //   icon: PhoneForwarded,
  //   hasDropdown: false,
  // },
  // {
  //   id: "security",
  //   label: "Security & Callback Settings",
  //   icon: Shield,
  //   hasDropdown: true,
  // },
  // {
  //   id: "webhook",
  //   label: "Webhook Settings",
  //   icon: Webhook,
  //   hasDropdown: false,
  // },
];

const variableList = [
  { name: "AGENT NAME" },
  { name: "BUSINESS NAME" },
  { name: "BUSINESSTYPE" },
  { name: "SERVICES" },
  { name: "LANGUAGE" },
  { name: "BUSINESS EMAIL ID" },
  { name: "current_time" },
  { name: "current_time_[timezone]" },
  { name: "MORE ABOUT YOUR BUSINESS" },
  { name: "AGENTNOTE" },
];

export function AgentDetailView({
  agent,
  business,
  knowledge_base_texts,
  total_call,
  onBack,
  agentName,
  dropdowns = {}, // fallback to empty object
  toggleDropdown,
  setShowAgentModal,
  setAgentData,
  languages,
}: AgentDetailViewProps) {
  const [activeTab, setActiveTab] = useState("functions");
  const [retellVoices, setRetellVoices] = useState(
    [] || agent?.agentVoice || "English(US)"
  );
  const [isDynamicView, setIsDynamicView] = useState(false);
  const [prompt, setPrompt] = useState(agent.rawPromptTemplate || "");
  const dynamicPrompt = agent.dynamicPromptTemplate || "";
  const [modelName, setModelName] = useState(
    agent.modelName || "gemini-2.0-flash"
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState(
    agent?.agentVoice || ""
  );
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([
    "Sales Docs",
  ]); // Dummy data; replace with fetched data if needed
  const [businessSearch, setBusinessSearch] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  //  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(allBusinessTypes)
  const [allServices, setAllServices] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [selectedType, setSelectedType] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [newService, setNewService] = useState("");
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
  // const [newKnowledgeName, setNewKnowledgeName] = useState("");
  const [showAddOptions, setShowAddOptions] = useState(false);
  // const [form, setForm] = useState({ businessUrl: "", services: [], customServices: [], businessType: "" });
  const [isWebsiteValid, setIsWebsiteValid] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customText, setCustomText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [form, setForm] = useState<any>({});
  const [newKnowledgeName, setNewKnowledgeName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    agent?.agentLanguageCode || ""
  );

  const textareaRef = useRef(null);

  const parsedVariables =
    typeof agent?.promptVariablesList === "string"
      ? JSON.parse(agent.promptVariablesList)
      : agent?.promptVariablesList || [];

  const insertVariableAtCursor = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = prompt.slice(0, start);
    const after = prompt.slice(end);
    const variableText = `{{${variable}}}`;
    const newPrompt = before + variableText + after;
    setPrompt(newPrompt);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variableText.length,
        start + variableText.length
      );
    }, 0);
  };

  const liveDynamicPrompt = prompt.replace(/{{(.*?)}}/g, (_match, varName) => {
    const found = parsedVariables.find(
      (v) => v.name.toLowerCase() === varName.trim().toLowerCase()
    );
    if (!found) return _match;
    const val = found.value;
    if (Array.isArray(val)) {
      return val.map((s) => s.service || s).join(", ");
    }
    return val ?? "";
  });

  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handledeleteknowledgebase = async (knowledge_base_id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/knowledgeBase/deleteKnowledgeBase/${knowledge_base_id}`
      );
      if (res.data?.status === true) {
        Swal.fire("Deleted!", "Knowledge base deleted successfully", "success");
        setKnowledgeBases((prev) =>
          prev.filter((id) => id !== knowledge_base_id)
        );
      } else {
        Swal.fire("Error", "Could not delete the knowledge base", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleWebsiteBlur = async () => {
    const url = form.businessUrl;
    if (!url) return;

    setIsVerifying(true);
    try {
      const result = await validateWebsite(url); // your API
      setIsWebsiteValid(result.valid);
    } catch (err) {
      console.error("Website verification error:", err);
      setIsWebsiteValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const getLeadTypeChoices = () => {
    const fixedChoices = [
      "Spam Caller",
      "Irrelvant Call",
      "Angry Old Customer",
    ];
    const allServices = [...customServices, ...businessServiceNames];
    const cleanedServices = allServices
      .map((service) => service?.trim()) // remove extra whitespace
      .filter((service) => service && service?.toLowerCase() !== "other")
      .map((service) => {
        const normalized = service?.replace(/\s+/g, " ")?.trim();
        return `Customer for ${normalized}`;
      });
    const combinedChoices = Array.from(
      new Set([...fixedChoices, ...cleanedServices])
    );
    return combinedChoices;
  };
  console.log(knowledge_base_texts, "knowledge_base_texts");
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
  // const URL = "https://rex-bk.truet.net";

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
                  <span>{business?.businessType || "NA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{business?.knowledge_base_texts?.phone || "NA"}</span>
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
                  {opt.hasDropdown &&
                    (isDropdownOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </button>

                {/* Knowledge Base Dropdown Items */}
                {opt.id === "knowledge" && isDropdownOpen && (
                  <div className="ml-8 mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {agent.knowledgeBaseId}
                      </span>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => {
                          setKnowledgeBases((prev) => {
                            const trimmed = newKnowledgeName.trim();
                            return prev.includes(trimmed)
                              ? prev
                              : [...prev, trimmed];
                          });
                        }}
                      >
                        <Trash2
                          onClick={() =>
                            handledeleteknowledgebase(agent.knowledgeBaseId)
                          }
                          className="h-4 w-4"
                        />
                      </button>
                    </div>

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
              {/* {dropdowns?.model ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )} */}
            </button>
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
              {/* {dropdowns?.agent ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )} */}
            </button>
            {dropdowns?.agent && (
              <div className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
                {retellVoices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={async () => {
                      try {
                        setSelectedVoiceId(voice.voice_id);

                        // ✅ Only use setAgentData if it's passed
                        if (typeof setAgentData === "function") {
                          setAgentData((prev) => ({
                            ...prev,
                            voice_id: voice.voice_id,
                          }));
                        }

                        toggleDropdown("agent");

                        await axios.put(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/agent/update/${agent.agent_id}`,
                          {
                            voice_id: voice.voice_id,
                          }
                        );

                        console.log("Voice updated successfully");
                      } catch (err) {
                        console.error("Failed to update voice", err);
                      }
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
              // onClick={() => toggleDropdown("language")}
            >
              <span>
                {Array.isArray(languages)
                  ? languages.find((l) => l.locale === selectedLanguage)
                      ?.name || "Select Language"
                  : "Select Language"}
              </span>
              {/* {dropdowns?.language ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )} */}
            </button>
            {dropdowns?.language && (
              <div className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto ">
                {languages.map((lang) => (
                  <div
                    key={lang.locale}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    // onClick={() => {
                    //   setSelectedLanguage(lang.locale);
                    //   setAgentData((prev) => ({
                    //     ...prev,
                    //     language: lang.locale,
                    //   }));
                    //   toggleDropdown("language");
                    // }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 border rounded px-3 py-1 text-sm bg-white shadow-sm"
            onClick={() => toggleDropdown("variables")}
          >
            <Plus size={16} />
            <span>Variables</span>
            {dropdowns?.variables ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {dropdowns?.variables && (
            <div
              className="absolute mt-1 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto"
              style={{ zIndex: "9999" }}
            >
              {parsedVariables.map((v) => (
                <div
                  key={v.name}
                  className="flex flex-col gap-1 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{v.name}</span>
                    <button onClick={() => insertVariableAtCursor(v.name)}>
                      <Plus
                        size={14}
                        className="text-green-600 hover:text-green-800"
                      />
                    </button>
                  </div>
                  <div className="text-gray-500 truncate text-xs">
                    {Array.isArray(v.value)
                      ? v.value.map((s) => s.service || s).join(", ")
                      : v.value ?? ""}
                  </div>
                </div>
              ))}
            </div>
          )}
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

        {isDynamicView ? (
          <div
            className="min-h-[60vh] max-h-[60vh] overflow-y-auto p-4 border rounded text-sm font-mono bg-gray-50 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: liveDynamicPrompt.replace(
                /{{(.*?)}}/g,
                (_match, p1) =>
                  `<span class="font-semibold text-green-600">${p1}</span>`
              ),
            }}
          />
        ) : (
          <div className="relative min-h-[60vh] max-h-[60vh] overflow-y-auto border rounded">
            {/* Highlighted version underneath (colored text) */}
            <pre
              aria-hidden="true"
              className="absolute inset-0 z-0 p-4 text-sm font-mono bg-white text-black whitespace-pre-wrap pointer-events-none"
              dangerouslySetInnerHTML={{
                __html: prompt
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(
                    /{{(.*?)}}/g,
                    '<span class="bg-yellow-100 text-yellow-700 font-semibold rounded px-1">$&</span>'
                  ),
              }}
            />

            {/* Editable textarea on top (transparent text, visible caret) */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="absolute inset-0 z-10 w-full h-full resize-none p-4 text-sm font-mono bg-transparent text-transparent caret-black whitespace-pre-wrap overflow-y-auto focus:outline-none"
              placeholder="Enter system prompt here..."
              spellCheck={false}
            />
          </div>
        )}

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
                  const res = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/agent/llmprompt/update/${agent.llmId}`,
                    { llmId: agent.llmId, prompt }
                  );
                  if (res.data.status === true)
                    Swal.fire("Prompt Updated Successfully");
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
                <label className="block text-sm font-medium">
                  Knowledge Base Name
                </label>
                <Input
                  value={newKnowledgeName}
                  onChange={(e) => setNewKnowledgeName(e.target.value)}
                  placeholder="Enter knowledge base name"
                />
              </div>

              {/* + Add Options */}
              {newKnowledgeName.trim() !== "" && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddOptions(!showAddOptions)}
                  >
                    + Add
                  </Button>

                  {showAddOptions && (
                    <div className="mt-2 space-y-3 border p-3 rounded-md bg-gray-50">
                      {/* Add URL */}
                      <div>
                        <label className="text-sm font-medium">
                          Website URL
                        </label>
                        <div className="relative w-full">
                          <Input
                            placeholder="https://example.com"
                            value={form.businessUrl || ""}
                            onChange={(e) => {
                              setForm({ ...form, businessUrl: e.target.value });
                              setIsWebsiteValid(null);
                            }}
                            onBlur={handleWebsiteBlur}
                          />
                          {isVerifying && (
                            <span className="absolute right-2 top-2 text-xs text-blue-500">
                              Verifying...
                            </span>
                          )}
                          {isWebsiteValid === true && (
                            <span className="absolute right-2 top-2 text-xs text-green-600">
                              ✓ Valid
                            </span>
                          )}
                          {isWebsiteValid === false && (
                            <span className="absolute right-2 top-2 text-xs text-red-600">
                              ✗ Invalid
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add Files */}
                      <div>
                        <label className="text-sm font-medium">
                          Upload Files
                        </label>
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) =>
                            setUploadedFiles([...e.target.files])
                          }
                        />
                      </div>

                      {/* Add Text */}
                      <div>
                        <label className="text-sm font-medium">
                          Paste Text
                        </label>
                        <textarea
                          rows={4}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Paste business content here..."
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddKnowledgeModal(false);
                    setNewKnowledgeName("");
                    setShowAddOptions(false);
                    setForm({ ...form, businessUrl: "" });
                    setCustomText("");
                    setUploadedFiles([]);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={async () => {
                    const API_KEY = "Bearer YOUR_RETELL_API_KEY"; // Replace this
                    const API_BASE_URL = "https://api.retellai.com/v1";

                    const texts = customText.trim()
                      ? [{ title: "Custom Text", text: customText.trim() }]
                      : [];

                    const urls = form.businessUrl?.trim()
                      ? [form.businessUrl.trim()]
                      : [];

                    const files = uploadedFiles?.length ? uploadedFiles : [];

                    const formData = new FormData();

                    texts.forEach((t, i) => {
                      formData.append(
                        `knowledge_base_texts[${i}][title]`,
                        t.title
                      );
                      formData.append(
                        `knowledge_base_texts[${i}][text]`,
                        t.text
                      );
                    });

                    urls.forEach((url, i) => {
                      formData.append(`knowledge_base_urls[${i}]`, url);
                    });

                    files.forEach((file) => {
                      formData.append("knowledge_base_files", file);
                    });

                    try {
                      if (agent.knowledgeBaseId) {
                        // ✅ Add sources to existing KB
                        await axios.post(
                          `${API_BASE_URL}/knowledge-bases/${agent.knowledgeBaseId}/sources`,
                          formData,
                          {
                            headers: {
                              Authorization: API_KEY,
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                      } else {
                        // 🆕 Create new KB
                        formData.append(
                          "knowledge_base_name",
                          newKnowledgeName.trim()
                        );

                        const res = await axios.post(
                          `${API_BASE_URL}/knowledge-bases`,
                          formData,
                          {
                            headers: {
                              Authorization: API_KEY,
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );

                        const newKBId = res.data.knowledge_base_id;
                        // 🔁 Optionally update agent or store KB ID in DB/state
                        console.log("New KB created:", newKBId);
                      }

                      setKnowledgeBases((prev) => [
                        ...prev,
                        newKnowledgeName.trim(),
                      ]);
                      setShowAddKnowledgeModal(false);
                      setNewKnowledgeName("");
                      setShowAddOptions(false);
                      setForm({ ...form, businessUrl: "" });
                      setCustomText("");
                      setUploadedFiles([]);
                    } catch (err) {
                      console.error("Failed to add/create KB:", err);
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
