"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Pause, MoreVertical, Edit, Trash2, Power, PhoneCall, Link } from "lucide-react";
import { countAgentsbyUserId, createAgent, getRetellVoices } from "@/Services/auth";
import { languages } from "./languageOptions";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Modal from "./ui/modal";
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

export default function AgentFormSetup() {
  const [form, setForm] = useState<any>({
    language: "",
    agentName:'',
    gender: "",
    voice: "",
    selectedVoice: null,
    avatar: "",
  });
  const [voices, setVoices] = useState<any[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const[loading,setLoading]=useState(false)
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const [agentExists, setAgentExists] = useState<null | boolean>(null);
  const [agentData, setAgentData] = useState<any>(null);
   
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
const [showCallModal, setShowCallModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [assignPhoneModal, setAssignPhoneModal] = useState(false);
const [showCancelConfirm, setShowCancelConfirm] = useState(false);
const [showDeactivateModal, setShowDeactivateModal] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [loading, setLoading] = useState(false);
 const getLeadTypeChoices = () => {
        const fixedChoices = ["Spam Caller", "Irrelvant Call", "Angry Old Customer","Customer"];
        // const allServices = [...customServices, ...businessServiceNames];
        const cleanedServices = fixedChoices
            .map(service => service?.trim()) // remove extra whitespace
            .filter(service => service && service?.toLowerCase() !== "other")
            .map(service => {
                const normalized = service?.replace(/\s+/g, " ")?.trim();
                return `Customer for ${normalized}`;
            });
        const combinedChoices = Array.from(new Set([...fixedChoices, ...cleanedServices]));
        return combinedChoices;
    }
  const handleAction = (action) => {
    switch (action) {
      case "edit":
        setShowEditModal(true);
        break;
      case "delete":
        setShowDeleteConfirm(true);
        break;
      case "deactivate":
        Swal.fire("Agent Deactivated", "", "info");
        break;
      case "cancel":
        setShowCancelConfirm(true);
        break;
      case "assign":
        Swal.fire("Phone Assigned", "", "success");
        break;
      case "test":
        Swal.fire("Testing Agent...", "", "info");
        break;
      case "call":
        Swal.fire("Call Link Opened", "", "success");
        break;
      default:
        break;
    }
  };
const userId=localStorage.getItem("userId")
useEffect(() => {
  const fetchAgentStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneragent/${userId}`);
     console.log(res)
      if (res.data.status === true) {
        setAgentExists(true);
        setAgentData(res.data.agents[0]);
      } else {
        setAgentExists(false);
      }
    } catch (error) {
      console.error("Error fetching agent status:", error);
      setAgentExists(false);
    }
  };

  fetchAgentStatus();
}, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const voicesRes = await getRetellVoices();
      setVoices(voicesRes);
    } catch (err) {
      console.error("Error loading voices:", err);
    }
  };

  const filteredVoices = voices.filter(
    (v) => v.gender?.toLowerCase() === form.gender?.toLowerCase()
  );

  const togglePlay = (index: number) => {
    const current = audioRefs.current[index];
    if (!current) return;

    if (playingIdx === index) {
      current.pause();
      setPlayingIdx(null);
    } else {
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a) a.pause();
      });
      current.play();
      setPlayingIdx(index);
    }

    current.onended = () => setPlayingIdx(null);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");

    if (!form.name ||!form.language || !form.gender || !form.voice || !form.avatar) {
     Swal.fire("Please fill all required fields: Name, Language, Gender, Voice, Avatar.");

      return;
    }

    try {
setLoading(true);
      const businessPayload = {
        userId,
        businessType: "AI Virtual Receptionist",
        businessName: "Receptin",
        businessSize: "50-100",
        buisnessService: ["AI Virtual Receptionist Service"],
        buisnessEmail: "support@rxpt.us",
        address1:"11210 NW 45th St #, Coral Springs, FL 33065, United States",
        city:"Coral Springs",
         state: "Florida",
  country: "United States",
  isWebsiteUrl:'www.rxpt.us',
  street_number: "11210 NW 45th St #",

      };

      const businessRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/create`,
        businessPayload
      );

      const businessId = businessRes.data.record.businessId;
      const agentCode = businessRes.data.agentCode;
      localStorage.setItem("BusinessId", businessId);
      localStorage.setItem("agentCode", agentCode);

      const knowledgeText = [
        {
          title: "Business Details",
          text: `Name: Receptin
Address: 11210 NW 45th St #, Coral Springs, FL 33065, United States
Phone: +1 (772) 271 7966
Website: www.rxpt.us
Email: support@rxpt.us
About: N/A
Google: N/A`,
        },
      ];

      let agentCount = 0;
      let knowledgeBaseName = "";
      try {
        agentCount = await countAgentsbyUserId(userId);
        knowledgeBaseName = `Prtnr_${userId}_${agentCode}_#${agentCount + 1}`;
        localStorage.setItem("knowledgebaseName", knowledgeBaseName);
      } catch (error) {
        console.error("Error generating knowledgeBaseName:", error);
        return null;
      }

      const knowledgeFormData = new FormData();
      knowledgeFormData.append("knowledge_base_name", knowledgeBaseName);
      knowledgeFormData.append("enable_auto_refresh", "true");
      knowledgeFormData.append("knowledge_base_texts", JSON.stringify(knowledgeText));
   knowledgeFormData.append("knowledge_base_urls", JSON.stringify(["https://www.rxpt.us"]));


      const kbRes = await axios.post(
        "https://api.retellai.com/create-knowledge-base",
        knowledgeFormData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const knowledge_Base_ID = kbRes?.data?.knowledge_base_id;
    localStorage.setItem("knowledge_Base_ID",knowledge_Base_ID)

      const partnername = localStorage.getItem("partnername") || "Receptin";
      const partnerFirstName = partnername.split(" ")[0];
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentTime = new Date().toLocaleString("en-US", { timeZone });

      const filledPrompt = `
You are ${form.agentName}, a ${form.gender} assistant to ${partnername}, who helps ${partnerFirstName} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base. You are a multilingual reception agent who can switch languages while on the call if the caller wants to.

- Current Time: ${currentTime}  
- Timezone: ${timeZone}

Keep the conversation concise and to the point.
`;

      const promptVariablesList = {
        agentName: { key: "AGENT NAME", value: form.agentName?.split(" ")[0] || "Assistant" },
        agentGender: { key: "AGENT GENDER", value: form.gender || "neutral" },
        partnerNameFull: { key: "PARTNER FULL NAME", value: "Receptin" },
        partnerNameHalf: { key: "PARTNER HALF NAME", value: "Receptin" },
        businessName: { key: "BUSINESS NAME", value: "Receptin" },
        businessEmail: { key: "BUSINESS EMAIL ID", value: "support@rxpt.us" },
        aboutBusiness: { key: "MORE ABOUT YOUR BUSINESS", value: "We provide virtual AI receptionist services." },
        businessAddress: { key: "BUSINESS ADDRESS", value: "11210 NW 45th St #, Coral Springs, FL 33065, United States" },
        businessWebsite: { key: "BUSINESS WEBSITE", value: "www.rxpt.us" },
        businessPhone: { key: "BUSINESS PHONE", value: "+1 (772) 271 7966" },
        businessType: { key: "BUSINESSTYPE", value: "AI Virtual Receptionist" },
        commaSeparatedServices: { key: "SERVICES", value: "AI Virtual Receptionist Service" },
        languageSelect: { key: "LANGUAGE", value: form.language || "English" },
        timeZone: { key: "TIMEZONE", value: timeZone },
        current_time: { key: "CURRENT TIME", value: currentTime },
        [`current_time_[${timeZone}]`]: { key: `CURRENT TIME IN ${timeZone}`, value: currentTime },
      };
 const agentConfig = {
                version: 0,
                model: "gemini-2.0-flash",
                model_temperature: 0,
                model_high_priority: true,
                tool_call_strict_mode: true,
                general_prompt: filledPrompt,
               
                general_tools: [
                    {
                        type: "end_call",
                        name: "end_call",
                        description: "End the call with user.",
                    },
                    {
                        "type": "extract_dynamic_variable",
                        "name": "extract_user_details",
                        "description": "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
                        "variables": [
                            {
                                "type": "string",
                                "name": "email",
                                "description": "Extract the user's email address from the conversation"
                            },
                            {
                                "type": "number",
                                "name": "phone",
                                "description": "Extract the user's phone number from the conversation"
                            },
                            {
                                "type": "string",
                                "name": "address",
                                "description": "Extract the user's address from the conversation"
                            },
                            {
                                "type": "string",
                                "name": "reason",
                                "description": "Extract the user's reason for calling from the conversation"
                            },
                            {
                                "type": "string",
                                "name": "name",
                                "description": "Extract the user's name from the conversation\""
                            },
                        ]
                    }

                ],
                states: [
                    {
                        name: "information_collection",
                        state_prompt: `Greet the user with the begin_message and assist with their query.

                               If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words (like "bad service", "unhappy", "terrible","waste of time"),
                               ask them: "I'm sorry to hear that. Could you please tell me about your concern?"
                               Analyze their response. 
                               
                                If the concern contains **spam, irrelevant or abusive content**
                                (e.g., random questions, profanity, jokes), say:
                                "I’m here to assist with service-related concerns. Could you please share your issue regarding our service?"
                                and stay in this state.

                                If the concern is **service-related** or **business** (e.g., staff, delay, poor support),
                                transition to dissatisfaction_confirmation.

                                If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
                                transition to appointment_booking.

                                If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
                                If the user wants to end the call transition to end_call_state`,
                        edges: [

                            {
                                destination_state_name: "dissatisfaction_confirmation",
                                description: "User sounds angry or expresses dissatisfaction."
                            }
                        ]
                    },

                    {
                        name: "appointment_booking",
                        state_prompt: "## Task\nYou will now help the user book an appointment."
                    },

                    // 🌟 State: Dissatisfaction Confirmation
                    {
                        name: "dissatisfaction_confirmation",
                        state_prompt: `
                            Say: "I'm sorry you're not satisfied. Would you like me to connect you to a team member? Please say yes or no."
                            Wait for their response.

                            If the user says yes, transition to call_transfer.
                            If the user says no, transition to end_call_state.
                            If the response is unclear, repeat the question once.
                        `,
                        edges: [
                            {
                                destination_state_name: "call_transfer",
                                description: "User agreed to speak to team member."
                            },
                            {
                                destination_state_name: "end_call_state",
                                description: "User declined to speak to team member."
                            }
                        ],
                        tools: []
                    },

                    // 🌟 State: Call Transfer
                    {
                        name: "call_transfer",
                        state_prompt: `
                            Connecting you to a team member now. Please hold.
                        `,
                        tools: [
                            {
                                type: "transfer_call",
                                name: "transfer_to_team",
                                description: "Transfer the call to the team member.",
                                transfer_destination: {
                                    type: "predefined",
                                    number: "{{business_Phone}}"
                                },
                                transfer_option: {
                                    type: "cold_transfer",
                                    public_handoff_option: {
                                        message: "Please hold while I transfer your call."
                                    }
                                },
                                speak_during_execution: true,
                                speak_after_execution: true,
                                failure_message: "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
                            }
                        ],
                        edges: []
                    },
                    {
                        name: "end_call_state",
                        state_prompt: `
                            Politely end the call by saying: "Thank you for calling. Have a great day!"
                        `,
                        tools: [
                            {
                                type: "end_call",
                                name: "end_call1",
                                description: "End the call with the user."
                            }
                        ],
                        edges: []
                    }
                ],
                starting_state: "information_collection",
                // begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
                default_dynamic_variables: {
                    customer_name: "John Doe",
                    // business_Phone: businessPhone,
                    // business_email: business.email,
                    timeZone: timeZone

                },
            };
             const knowledgeBaseId = localStorage.getItem("knowledge_Base_ID");
            if (knowledgeBaseId) {
                agentConfig.knowledge_base_ids = [knowledgeBaseId];
            }
      const llmRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/createAdmin/llm`,
       agentConfig,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
          },
        }
      );

      const llmId = llmRes.data.data.llm_id;

      const agentRes = await axios.post(
        "https://api.retellai.com/create-agent",
        {
          response_engine: { type: "retell-llm", llm_id: llmId },
          voice_id: form.voice,
          agent_name: form.selectedVoice?.voice_name || "Virtual Assistant",
          language: "multi",
            post_call_analysis_model: "gpt-4o-mini",
                    responsiveness: 1,
                    enable_backchannel: true,
                    interruption_sensitivity: 0.91,
                    backchannel_frequency: 0.7,
                    backchannel_words: ["Got it", "Yeah", "Uh-huh", "Understand", "Ok", "hmmm"],
                    post_call_analysis_data: [
                        {
                            type: "enum",
                            name: "lead_type",
                            description: "Feedback given by the customer about the call.",
                            choices: getLeadTypeChoices(),
                        },
                        {
                            type: "string",
                            name: "name",
                            description: "Extract the user's name from the conversation",
                            examples: [
                                "Ajay Sood",
                                "John Wick",
                                "Adam Zampa",
                                "Jane Doe",
                                "Nitish Kumar",
                                "Ravi Shukla",
                            ],
                        },
                        {
                            type: "string",
                            name: "email",
                            description: "Extract the user's email from the conversation",
                            examples: [
                                "john.doe@example.com",
                                "nitish@company.in",
                                "12@gmail.com",
                            ],
                        },
                        {
                            type: "string",
                            name: "reason",
                            description:
                                "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
                            examples: [
                                "Schedule an appointment",
                                "Ask about services",
                                "Request for accounting help",
                            ],
                        },
                        {
                            type: "string",
                            name: "address",
                            description: "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
                            examples: ["123 Main St, Delhi", "42 Wallaby Way, Sydney", "1490 Aandhar Eleven"],
                        },
                        {
                            type: "number",
                            name: "phone_number",
                            description:
                                "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible.",

                        },
                    ],
                    end_call_after_silence_ms: 30000,
                    normalize_for_speech: true,
                    webhook_url: `${process.env.NEXT_PUBLIC_API__URL}/api/agent/updateAgentCall_And_Mins_WebHook`,
                
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
          },
        }
      );

      const agentId = agentRes.data.agent_id;

      const dbPayload = {
        userId,
        agent_id: agentId,
        llmId,
        avatar: form.avatar,
        agentVoice: form.voice,
        knowledgebaseId: knowledge_Base_ID,
        agentAccent: form.selectedVoice?.voice_accent || "American",
        agentRole: form.role,
        agentName: form.name || "Virtual Assistant",
        agentLanguageCode: form.language,
        agentLanguage: form.language,
        dynamicPromptTemplate: filledPrompt,
        rawPromptTemplate: filledPrompt,
        promptVariablesList: JSON.stringify(promptVariablesList),
        agentGender: form.gender,
        agentPlan: "Partner",
        agentStatus: true,
        businessId,
        additionalNote: "",
      };

      const saveRes = await createAgent(dbPayload);
      if (saveRes.status === 200 || saveRes.status === 201) {
        setLoading(false)
        alert("Agent created successfully!");
        localStorage.removeItem("agentCode");
        localStorage.removeItem("businessType");
        
      } else {
        throw new Error("Agent creation failed.");
           setLoading(false)
      }
    } catch (err) {
      console.error("Error during full setup:", err);
      Swal.fire("Something went wrong during setup.");
         setLoading(false)
    }
  };




   if (agentExists === null) {
    return (
      <div className="text-center mt-10">
        <FadeLoader color="#6524EB" />
      </div>
    );
  }

  // Agent Already Exists View
 if (agentExists && agentData) {
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Partner Agent
        </h2>
        {/* More Options Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="text-gray-500 hover:bg-gray-100"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="text-2xl">⋮</span>
          </Button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border z-50">
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setShowCallModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    📞 Test Call
                  </button>
                </li>
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setShowEditModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    ✏️ Edit Agent
                  </button>
                </li>
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setAssignPhoneModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    📱 Assign Phone Number
                  </button>
                </li>
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setShowCancelConfirm(true);
                      setShowDropdown(false);
                    }}
                  >
                    ❌ Cancel Subscription
                  </button>
                </li>
                <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setShowDeactivateModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    🚫 Deactivate Agent
                  </button>
                </li>
                {/* <li>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowDropdown(false);
                    }}
                  >
                    🗑️ Delete Agent
                  </button>
                </li> */}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Agent Details */}
      <div className="space-y-3 text-sm text-gray-800 mb-6">
        <p><strong>Name:</strong> {agentData.agentName}</p>
        <p><strong>Gender:</strong> {agentData.agentGender || "N/A"}</p>
        <p><strong>Language:</strong> {agentData.agentLanguage}</p>
        <p><strong>Voice:</strong> {agentData.agentVoice}</p>
      </div>
          <div>
            <strong>Avatar:</strong><br />
            {agentData.avatar ? (
              <img
                src={agentData.avatar}
                alt="Agent Avatar"
                className="w-20 h-20 rounded-full mt-2"
              />
            ) : (
              <p className="text-gray-500">No avatar available</p>
            )}
          </div>
        </div>
      
  );
}

  
   
  
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Create Your Own Agent
        </h2>
      </div>
      {/* Language */}

      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Name
  </label>
  <input
    type="text"
    maxLength={20}
   value={form.agentName}

    onChange={(e) => {
      const value = e.target.value;
      const isValid = /^[A-Za-z\s]*$/.test(value); // letters and spaces only
      if (isValid || value === "") {
        setForm({ ...form, agentName: value });
      }
    }}
    placeholder="Enter your name"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Language
        </label>
        <Select onValueChange={(v) => setForm({ ...form, language: v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.locale} value={lang.locale}>
                <span className="inline-flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w20/${lang.locale.split("-")[1]?.toLowerCase() || "us"}.png`}
                    alt="flag"
                    className="w-5 h-4"
                  />
                  {lang.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
         <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <Select
          onValueChange={(v) =>
            setForm((prev: any) => ({
              ...prev,
              gender: v,
              avatar: "",
              voice: "",
              selectedVoice: null,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Voice */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Voice
        </label>
        {filteredVoices.length === 0 ? (
          <p className="text-sm text-gray-500"> Select gender first.</p>
        ) : (
          <Select
            onValueChange={(v) => {
              const selectedVoice = filteredVoices.find((voice) => voice.voice_id === v);
              setForm({ ...form, voice: v, selectedVoice });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose voice" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {filteredVoices.map((voice, index) => (
                <SelectItem key={index} value={voice.voice_id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{voice.voice_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {voice.accent || voice.provider}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      style={{zIndex:"99999",height:'45px',width: '53px'}}
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(index);
                      }}
                    >
                      {playingIdx === index ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <audio ref={(el) => (audioRefs.current[index] = el)} style={{ display: "none" }}>
                      <source src={voice.preview_audio_url} type="audio/mpeg" />
                    </audio>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Avatar */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar
        </label>
        {form.gender ? (
          <Select onValueChange={(v) => setForm({ ...form, avatar: v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose avatar" />
            </SelectTrigger>
            <SelectContent>
              {avatars[form.gender]?.map((av, index) => (
                <SelectItem key={index} value={av.img}>
                  <div className="flex items-center gap-2">
                    <img
                      src={av.img}
                      alt={`Avatar ${index + 1}`}
                      className="w-6 h-6 rounded-full"
                    />
                    Avatar {index + 1}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-gray-500">Select gender to choose avatar</p>
        )}
      </div>

      

    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
  {loading ? "Creating..." : "Create"}
</Button>
<br/><br/>
      <p style={{ marginLeft: "30px" }}>
        <strong>Note:</strong> Please Don't make if you have already created. It will override last one.
      </p>
    </div>
  );
}
