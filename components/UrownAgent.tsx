"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { createAgent, getRetellVoices } from "@/Services/auth";
import { languages } from "./languageOptions";
import { AlertTitle } from "./ui/alert";
import Swal from "sweetalert2";

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

const roles = [
  { title: "Receptionist" },
  { title: "Sales Assistant" },
  { title: "Support Agent" },
];

export default function AgentFormSetup() {
  const [form, setForm] = useState<any>({
    language: "",
    gender: "",
    voice: "",
    selectedVoice: null,
    avatar: "",
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [voices, setVoices] = useState<any[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

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
   const userId=localStorage.getItem("userId")
   if(!form.language){
    Swal.fire("Please Select Language first")
    return;
   }
   if(!form.gender){
    Swal.fire("Select Gender first")
    return;
   }
   if(!form.voice){
    Swal.fire("Please choose voice")
    return;
   }
   if(!form.avatar){
    Swal.fire("Please Select avatar")
    return;
   }
    try {
      const {
        language,
        gender,
        voice,
        agentname,
        avatar,
        
        role,
      } = form;
      console.log(voice, "voice");

      const promptVars = {
        agentName: form.selectedVoice?.voice_name || "Virtual Assistant",
        agentGender: form.gender,
      
        languageSelect: language,
       
      };
    //   const aboutBusinessForm =
    //     localStorage.getItem("businessonline") || form.about || "";

    //   const filledPrompt = getAgentPrompt({
    //     industryKey: businessType === "Other" ? customBuisness : businessType,
    //     roleTitle: selectedRole,
    //     agentName: knowledgebaseName,
    //     agentGender: gender,
    //     business: {
    //       businessName: businessName || "Your Business",
    //       email: email || "",
    //       aboutBusiness: about || "", // this can remain for context
    //       address: address || "",
    //     },
    //     languageSelect: "Multi",
    //     businessType,
    //     aboutBusinessForm, // this will now work fine
    //     commaSeparatedServices: services?.join(", ") || "",
    //     agentNote: "",
    //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //   });
    //   const filledPrompt2 = getAgentPrompt({
    //     industryKey: "{{businessType}}",
    //     roleTitle: "{{selectedRole}}",
    //     agentName: "{{AgentName}}",
    //     agentGender: "{{gender}}",
    //     business: {
    //       businessName: "{{businessName}}",
    //       email: "{{email}}",
    //       aboutBusiness: "{{about}}", // this can remain for context
    //       address: "{{address}}",
    //     },
    //     languageSelect: "{{language}}",
    //     businessType: "{{businessType}}",
    //     aboutBusinessForm: {
    //       businessUrl: "{{businesssURl}}",
    //       about: "{{About Business}}",
    //     }, // this will now work fine
    //     commaSeparatedServices: "{{services}}",
    //     agentNote: "",
    //     timeZone: "{{timeZone}}",
    //   });

    //   console.log("generatePrompt", filledPrompt2);
const filledPrompt = `
You are a Virtual Assistant for DesignersX, specializing in advanced customer engagement tools. Your task is to introduce and explain RexPT, an AI-driven virtual receptionist and call-answering solution, tailored for design-focused businesses.

Role & Tone  
You are polite, professional, and design-savvy.  
Think of yourself as a trusted assistant who understands the unique needs of design teams—branding, user experience, client communication.

Product (RexPT) Overview  
RexPT is an AI Virtual Receptionist that handles inbound calls seamlessly.  
It engages leads instantly, books meetings/calendar events automatically, and offers actionable insights through call analytics (https://www.rexpt.in).  
It revolutionizes front-desk operations by replacing manual reception tasks with smart, automated workflows.

Your Goals  
1. Clearly explain how RexPT helps design teams manage client calls—for inquiries, appointment scheduling, and lead nurturing—without missing a beat.  
2. Highlight benefits: 24/7 availability, seamless calendar integration, freeing up designers to focus on creativity & project delivery.  
3. Reference RexPT’s features (lead engagement, calendar booking, call analytics) succinctly.  
4. Use a friendly but knowledgeable tone, aligning with DesignersX brand voice.

Sample Interaction  
User: “What can RexPT do for my design agency?”  
Assistant: “RexPT acts like your smart front-desk—it answers every call, captures client details, auto-schedules meetings, and delivers call analytics so you never miss an opportunity—all while you focus on creative work.”
`;
      const agentConfig = {
        version: 0,
        model: "gemini-2.0-flash-lite",
        model_temperature: 0,
        model_high_priority: true,
        tool_call_strict_mode: true,
        general_prompt: filledPrompt,
        general_tools: [],
        starting_state: "information_collection",
        // begin_message: `Hi I’m ${promptVars.agentName}, calling from ${promptVars.business.businessName}. How may I help you?`,
        default_dynamic_variables: {
          customer_name: "John Doe",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        states: [
          {
            name: "information_collection",
            state_prompt: "## Task\nGreet the user and ask how you can help.",
            script: `
        if (wait_for_user_input) {
          speak("How can I assist you today?");
          wait_for_user_input();
        }
      `,
            edges: [],
          },
        ],
      };

      const llmRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/createAdmin/llm`,
        agentConfig,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(llmRes);
      const llmId = llmRes.data.data.llm_id;
      console.log(llmId);

      const finalAgentData = {
        response_engine: { type: "retell-llm", llm_id: llmId },
        voice_id: voice,
        // language,
        agent_name: form.selectedVoice?.voice_name || "Virtual Assistant",
        language: "multi",
        post_call_analysis_model: "gpt-4o-mini",
        responsiveness: 1,
        enable_backchannel: true,
        interruption_sensitivity: 0.91,
        normalize_for_speech: true,
        backchannel_frequency: 0.7,
        backchannel_words: [
          "Got it",
          "Yeah",
          "Uh-huh",
          "Understand",
          "Ok",
          "hmmm",
        ],
        post_call_analysis_data: [
          {
            type: "string",
            name: "Detailed Call Summary",
            description: "Summary of the customer call",
          },
          {
            type: "enum",
            name: "lead_type",
            description: "Customer feedback",
            choices: ["positive", "neutral", "negative"],
          },
        ],
      };
      console.log(finalAgentData);

      const agentRes = await axios.post(
        "https://api.retellai.com/create-agent",
        finalAgentData,
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
        avatar,
        agentVoice: voice,
        knowledgebaseId: localStorage.getItem("knowledgeBaseId"),
        agentAccent: form.selectedVoice?.voice_accent || "American",
        agentRole: selectedRole,
        agentName: form.selectedVoice?.voice_name || "Virtual Assistant",
        agentLanguageCode: language,
        agentLanguage: language,
        dynamicPromptTemplate: filledPrompt,
        rawPromptTemplate: filledPrompt,
        agentGender: gender,
        agentPlan: "Partner",
        agentStatus: true,
        businessId: localStorage.getItem("BusinessId"),
        additionalNote: "",
      };

      const saveRes = await createAgent(dbPayload);
      if (saveRes.status === 200 || saveRes.status === 201) {
        alert("Agent created successfully!");
        localStorage.removeItem("businessType");
        localStorage.removeItem("agentCode");
        localStorage.removeItem("");
        // onClose();
      } else {
        throw new Error("Agent creation failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Agent creation failed. Please check console for details.");
    } finally {
        alert("something wrong")
    }
}
 

      
  return (
    <>
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Create Your Own Agent
      </h2>

      {/* Language */}
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

      {/* Role */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <div className="space-y-2">
          {roles.map((role, index) => (
            <label
              key={index}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="role"
                value={role.title}
                checked={selectedRole === role.title}
                onChange={() => setSelectedRole(role.title)}
              />
              {role.title}
            </label>
          ))}
        </div>
      </div> */}

      <Button className="w-full" onClick={handleSubmit}>
     Create
      </Button>

<br/><br/>
      <p style={{marginLeft:'30px'}}><strong>Note:</strong> Please Don't make if you have already created It will override last one .</p>
    </div>
    </>
  );
}
