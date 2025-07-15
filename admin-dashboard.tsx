// "use client";
// import { useState } from "react";
// import { Sidebar } from "./components/sidebar";
// import { UserManagement } from "./components/user-management";
// import { UserDetails } from "./components/user-details";
// import { AgentBusinessList } from "./components/agent-business-list";
// import { AgentDetailView } from "./components/agent-detail-view";
// import { fetchAgentDetailById } from "./Services/auth";
// import { languages } from "./components/languageOptions";
// import { ReferralLink } from "./components/ReferralLink";
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   status: "Active" | "Inactive" | "Suspended";
//   lastLogin: string;
//   registrationDate: string;
//   contactNumber: string;
// }
// interface Agent {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: "Online" | "Offline" | "Busy";
//   callsHandled: number;
//   avgResponseTime: string;
// }
// interface Business {
//   id: string;
//   businessName: string;
//   userName: string;
//   userEmail: string;
//   industry: string;
//   agents: Agent[];
//   totalCalls: number;
//   activeAgents: number;
// }
// interface AdminDashboardProps {
//   onLogout: () => void;
// }
// export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
//   const [activeSection, setActiveSection] = useState("analytics");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [selectedAgent, setSelectedAgent] = useState<{
//     agent: Agent;
//     business: Business;
//     knowledge_base_texts: knowledge_base_texts;
//     total_call: total_call;
//   } | null>(null);
//   console.log(selectedAgent, "selectedAgent");
//   const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({
//     model: false,
//     agent: false,
//     language: false,
//   });
//   const toggleDropdown = (key: string) => {
//     setDropdowns((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };
//   const handleAgentClick = async (agentId: string, businessId: string) => {
//     try {
//       const data = await fetchAgentDetailById({ agentId, bussinesId });
//       setSelectedAgent(data);
//     } catch (err) {
//       console.error("Error fetching agent details", err);
//     }
//   };
//   const handleViewUser = (user: User) => {
//     setSelectedUser(user);
//   };
//   const handleBackToUsers = () => {
//     setSelectedUser(null);
//   };
//   const handleViewAgent = (
//     agent: any,
//     business: any,
//     knowledge_base_texts: any,
//     total_call: any
//   ) => {
//     setSelectedAgent({ agent, business, knowledge_base_texts, total_call });
//   };
//   const handleBackToAgents = () => {
//     setSelectedAgent(null);
//   };
//   const handleSectionChange = (section: string) => {
//     setSelectedUser(null);
//     setSelectedAgent(null);
//     setActiveSection(section);
//   };
//   const renderContent = () => {
//     if (selectedUser) {
//       return <UserDetails user={selectedUser} onBack={handleBackToUsers} />;
//     }
//     if (selectedAgent) {
//       return (
//         <AgentDetailView
//           agent={selectedAgent.agent}
//           business={selectedAgent.business}
//           total_call={selectedAgent.total_call}
//           KnowledgeBase={selectedAgent.knowledge_base_texts}
//           onBack={handleBackToAgents}
//           toggleDropdown={toggleDropdown}
//           dropdowns={dropdowns}
//           languages={languages}
//         />
//       );
//     }
//     switch (activeSection) {
//       case "users":
//         return <UserManagement onViewUser={handleViewUser} />;
//       case "agents":
//         return <AgentBusinessList onViewAgent={handleViewAgent} />;
//       case "referral":
//         return <ReferralLink />;
//       default:
//         return <UserManagement onViewUser={handleViewUser} />;
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 transition-all duration-300">
//       <Sidebar
//         activeSection={activeSection}
//         onSectionChange={handleSectionChange}
//         isCollapsed={isCollapsed}
//         onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
//         onLogout={onLogout}
//       />
//       <main
//         className={`transition-all duration-300 ${
//           isCollapsed ? "ml-16" : "ml-64"
//         } ${selectedAgent ? "ml-0" : ""}`}
//       >
//         {!selectedAgent && (
//           <div className="p-6">
//             <div className="max-w-7xl mx-auto">{renderContent()}</div>
//           </div>
//         )}
//         {selectedAgent && renderContent()}
//       </main>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { UserManagement } from "./components/user-management";
import { UserDetails } from "./components/user-details";
import { AgentBusinessList } from "./components/agent-business-list";
import { AgentDetailView } from "./components/agent-detail-view";
import { fetchAgentDetailById } from "./Services/auth";
import { languages } from "./components/languageOptions";
import { ReferralLink } from "./components/ReferralLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { ProfileView } from "./components/PofileView";
import AgentFormSetup from "./components/UrownAgent";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  registrationDate: string;
  contactNumber: string;
}
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Online" | "Offline" | "Busy";
  callsHandled: number;
  avgResponseTime: string;
}
interface Business {
  id: string;
  businessName: string;
  userName: string;
  userEmail: string;
  industry: string;
  agents: Agent[];
  totalCalls: number;
  activeAgents: number;
}
interface AdminDashboardProps {
  onLogout: () => void;
}

const STORAGE_KEY = "admin-active-section";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // initialize from localStorage, fallback to "users"
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "users";
    }
    return "users";
  });

  // write back whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeSection);
  }, [activeSection]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
const [adminUser, setAdminUser] = useState({
  name: "Admin",
  email: "admin@example.com",
  address: "123 Main St",
  profileImage: "",
});
  const [selectedAgent, setSelectedAgent] = useState<{
    agent: Agent;
    business: Business;
    knowledge_base_texts: any;
    total_call: any;
  } | null>(null);

  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({
    model: false,
    agent: false,
    language: false,
  });

  const toggleDropdown = (key: string) =>
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAgentClick = async (agentId: string, businessId: string) => {
    try {
      const data = await fetchAgentDetailById({ agentId, bussinesId: businessId });
      setSelectedAgent(data);
    } catch (err) {
      console.error("Error fetching agent details", err);
    }
  };
const handleProfileUpdate = async (formData: FormData) => {
  try {
    // Send formData to your backend API endpoint
    await axios.post("/api/update-profile", formData);
    // Optional: refresh user data from backend
    alert("Profile updated!");
  } catch (error) {
    console.error("Error updating profile", error);
  }
};

  const handleViewUser = (user: User) => setSelectedUser(user);
  const handleBackToUsers = () => setSelectedUser(null);

  const handleViewAgent = (
    agent: Agent,
    business: Business,
    knowledge_base_texts: any,
    total_call: any
  ) => setSelectedAgent({ agent, business, knowledge_base_texts, total_call });
  const handleBackToAgents = () => setSelectedAgent(null);

  const handleSectionChange = (section: string) => {
    setSelectedUser(null);
    setSelectedAgent(null);
    setActiveSection(section);
  };

  const renderContent = () => {
    if (selectedUser) {
      return <UserDetails user={selectedUser} onBack={handleBackToUsers} />;
    }
    if (selectedAgent) {
      return (
        <AgentDetailView
          agent={selectedAgent.agent}
          business={selectedAgent.business}
          total_call={selectedAgent.total_call}
          KnowledgeBase={selectedAgent.knowledge_base_texts}
          onBack={handleBackToAgents}
          toggleDropdown={toggleDropdown}
          dropdowns={dropdowns}
          languages={languages}
        />
      );
    }
    
  
    switch (activeSection) {
      case "users":
        return <UserManagement onViewUser={handleViewUser} />;
      case "agents":
        return <AgentBusinessList onViewAgent={handleViewAgent} />;
      case "referral":
        return <ReferralLink />;
 
        case "ProfileDetails":
          return <ProfileView/>;
        case "Ownagent":
          return<AgentFormSetup/>;
      default:
        return <UserManagement onViewUser={handleViewUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
        onLogout={onLogout}
      />
{/* <div className="absolute top-4 right-4 z-50">
  <Avatar onClick={() => setShowProfile(true)} className="cursor-pointer">
    <AvatarImage src={adminUser.profileImage} />
    <AvatarFallback>{adminUser.name[0]}</AvatarFallback>
  </Avatar>
</div> */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        } ${selectedAgent ? "ml-0" : ""}`}
      >
        {!selectedAgent && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </div>
        )}
        {selectedAgent && renderContent()}
      </main>
    </div>
  );
}
