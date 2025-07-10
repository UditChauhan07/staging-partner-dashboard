"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { AnalyticsSection } from "./components/analytics-section";
import { UserManagement } from "./components/user-management";
import { UserDetails } from "./components/user-details";
import { RoleManagement } from "./components/role-management";
import { AgentBusinessList } from "./components/agent-business-list";
import { AgentDetailView } from "./components/agent-detail-view";
import { fetchAgentDetailById } from "./Services/auth";
import { languages } from "./components/languageOptions";
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

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("analytics");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<{
    agent: Agent;
    business: Business;
    knowledge_base_texts: knowledge_base_texts;
    total_call: total_call;

  } | null>(null);
  console.log(selectedAgent, "selectedAgent");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({
    model: false,
    agent: false,
    language: false,
  });
  const toggleDropdown = (key: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAgentClick = async (agentId: string, businessId: string) => {
    try {
      const data = await fetchAgentDetailById({ agentId, bussinesId });
      setSelectedAgent(data);
    } catch (err) {
      console.error("Error fetching agent details", err);
    }
  };
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
  };

  const handleViewAgent = (agent: any, business: any, knowledge_base_texts: any, total_call: any) => {
    setSelectedAgent({ agent, business, knowledge_base_texts, total_call });
  };

  const handleBackToAgents = () => {
    setSelectedAgent(null);
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
      // case "analytics":
      //   return <AnalyticsSection />;
      case "users":
        return <UserManagement onViewUser={handleViewUser} />;
      // case "roles":
      //   return <RoleManagement />;
      case "agents":
        return <AgentBusinessList onViewAgent={handleViewAgent} />;
      // case "products":
      //   return (
      //     <div className="space-y-6 animate-in fade-in-50 duration-500">
      //       <div className="animate-in slide-in-from-left-5 duration-700">
      //         <h1 className="text-3xl font-bold text-gray-900">
      //           Product Management
      //         </h1>
      //         <p className="text-gray-600 mt-2">
      //           Manage your products and services
      //         </p>
      //       </div>
      //       <div className="bg-gray-100 rounded-lg p-12 text-center animate-in slide-in-from-bottom-5 duration-700 delay-200">
      //         <p className="text-gray-500">
      //           Product management features coming soon...
      //         </p>
      //       </div>
      //     </div>
      //   );
      // case "settings":
      //   return (
      //     <div className="space-y-6 animate-in fade-in-50 duration-500">
      //       <div className="animate-in slide-in-from-left-5 duration-700">
      //         <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      //         <p className="text-gray-600 mt-2">
      //           Configure your application settings
      //         </p>
      //       </div>
      //       <div className="bg-gray-100 rounded-lg p-12 text-center animate-in slide-in-from-bottom-5 duration-700 delay-200">
      //         <p className="text-gray-500">Settings panel coming soon...</p>
      //       </div>
      //     </div>
      //   );
      default:
        return <UserManagement onViewUser={handleViewUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={onLogout}
      />

      <main
        className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"
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
