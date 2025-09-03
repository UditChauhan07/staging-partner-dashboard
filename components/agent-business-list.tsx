"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  retrieveAllRegisteredUsers2,
  deactivateAgent,
  raiseagentRequest,
  getAgentRequestStatus,
  retrieveAllRegisteredUsers,
} from "@/Services/auth";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";
import AddAgentModal from "./Agentdetial";
import { FadeLoader } from "react-spinners";
import { RaiseAgentRequest } from "./raiseagentrequest";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AgentBusinessRow {
  agentId: string;
  agentName: string;
  businessName: string;
  userName: string;
  userEmail: string;
  agentPlan: string;
  status?: number;
  businessId: string;
}

interface AgentBusinessListProps {
  onViewAgent: (
    agent: any,
    business: any,
    knowledge_base_texts: any,
    total_call?: any
  ) => void;
}

export function AgentBusinessList({ onViewAgent }: AgentBusinessListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [agentData, setAgentData] = useState<AgentBusinessRow[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentBusinessRow | null>(
    null
  );
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaders, setLoaders] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc");

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentEmail, setSelectedAgentEmail] = useState<string | null>(
    null
  );

  const [requestedAgents, setRequestedAgents] = useState<Map<string, string>>(
    new Map()
  );
  const [requestingAgentId, setRequestingAgentId] = useState<string | null>(
    null
  );

  const agentsPerPage = 10;

  /** Fetch all registered users */
  async function fetchUsers() {
    try {
      setLoaders(true);
      const apiUsers = await retrieveAllRegisteredUsers();
      if (!Array.isArray(apiUsers)) return;

      const mappedUsers: User[] = apiUsers.map((u: any, index: number) => ({
        id: u.userId ?? `USR${String(index + 1).padStart(3, "0")}`,
        name: u.name ?? "N/A",
        email: u.email ?? "No Email",
        phone: u.phone ?? "N/A",
        referredBy: u.referredBy ?? "N/A",
      }));
      setUsersList(mappedUsers);
      setLoaders(false);
    } catch (err) {
      console.error(err);
      setLoaders(false);
    }
  }

  /** Fetch all agents and flatten business data */
  const fetchData = async () => {
    try {
      setLoaders(true);
      const res = await retrieveAllRegisteredUsers2();
      const flatList: AgentBusinessRow[] = [];

      res?.data?.forEach((user: any) => {
        user.businesses?.forEach((business: any) => {
          business.agents?.forEach((agent: any) => {
            flatList.push({
              businessId: business.businessId || business._id || "-",
              agentId: agent.agentId || agent.agent_id || "-",
              agentName: agent.agentName || "-",
              agentPlan: agent.agentPlan || "-",
              businessName: business.businessName || "-",
              userName: user.userName || "-",
              userEmail: user.userEmail || "-",
              status: agent.agentStatus ?? 1,
            });
          });
        });
      });

      setAgentData(flatList);
      setLoaders(false);
    } catch (err) {
      console.error(err);
      setLoaders(false);
    }
  };

  /** Fetch requested agent status */
  useEffect(() => {
    const fetchRequestedAgents = async () => {
      try {
        const updatedRequestedAgents = new Map<string, string>();
        const promises = agentData.map(async (agent) => {
          const data = await getAgentRequestStatus(agent.agentId);
          if (typeof data === "boolean") {
            if (data) updatedRequestedAgents.set(agent.agentId, "Not Resolved");
          } else if (data?.alreadyRequested) {
            updatedRequestedAgents.set(
              agent.agentId,
              data.Status || "Not Resolved"
            );
          }
        });
        await Promise.all(promises);
        setRequestedAgents(updatedRequestedAgents);
      } catch (err) {
        console.error(err);
      }
    };

    if (agentData.length) fetchRequestedAgents();
  }, [agentData]);

  /** Raise agent request */
  const handleRaiseRequest = async (
    comment: string,
    agentId: string,
    email: string
  ) => {
    if (!comment || !agentId || !email) return; // safeguard
    try {
      setRequestingAgentId(agentId);
      const res = await raiseagentRequest({ agentId, email, comment });
      if (res.status) {
        setRequestedAgents(
          (prev) => new Map(prev.set(agentId, "Not Resolved"))
        );
        Swal.fire({
          icon: "success",
          title: "Request Raised",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to raise request", "error");
    } finally {
      setRequestingAgentId(null);
      setIsRequestModalOpen(false); // close modal after success
    }
  };

  /** Deactivate agent */
  const handleDeactivateAgent = async (agent: AgentBusinessRow) => {
    if (!agent) return;
    const result = await Swal.fire({
      title: "Deactivate Agent?",
      text: `Are you sure you want to deactivate agent "${agent.agentName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deactivateAgent(agent.agentId);
        await fetchData();
        Swal.fire({
          icon: "success",
          title: "Agent Deactivated",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to deactivate agent",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchData();
  }, []);

  /** Filter, sort, and paginate agents */
  const filteredAgents = agentData
    .filter((row) => {
      const matchesSearch = [
        row.agentName,
        row.businessName,
        row.userName,
        row.userEmail,
      ].some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && row.status === 1) ||
        (statusFilter === "Inactive" && row.status !== 1);
      const matchesPlan = planFilter === "All" || row.agentPlan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = (a as any)[sortField] || "";
      const valB = (b as any)[sortField] || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const startIndex = (currentPage - 1) * agentsPerPage;
  const paginatedAgents = filteredAgents.slice(
    startIndex,
    startIndex + agentsPerPage
  );

  if (loading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-white/50 z-50">
        <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Agent Business List
          </h1>
          <p className="text-gray-600 mt-2">
            Manage agents across all businesses
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsAgentModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Agent
        </Button>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Agents</CardTitle>
            <div className="flex gap-4 mt-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm text-gray-600">Status </label>
                <select
                  className="mt-1 border rounded px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {/* Plan Filter */}
              <div>
                <label className="text-sm text-gray-600">Plan </label>
                <select
                  className="mt-1 border rounded px-2 py-1 text-sm"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {[...new Set(agentData.map((a) => a.agentPlan))].map(
                    (plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    )
                  )}
                </select>
              </div>
              {/* Sort */}
              <div>
                <label className="text-sm text-gray-600">Sort By </label>
                <select
                  className="mt-1 border rounded px-2 py-1 text-sm"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="agentName">Agent Name</option>
                  <option value="userName">User Name</option>
                  <option value="agentPlan">Plan</option>
                </select>
              </div>
              {sortField && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "dsc" : "asc"))
                  }
                >
                  {sortOrder === "asc" ? "↑ ASC" : "↓ DSC"}
                </Button>
              )}
              <Input
                placeholder="Search agents or businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block border rounded px-2 py-1 text-sm h-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>AgentID</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Business Name</th>
                  <th>Agent Name</th>
                  <th>Agent Status</th>
                  <th>Plan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loaders ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex justify-center items-center py-6">
                        <FadeLoader
                          height={10}
                          width={3}
                          color="#6524EB"
                          speedMultiplier={1.5}
                        />
                      </div>
                    </td>
                  </tr>
                ) : paginatedAgents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No agents found.
                    </td>
                  </tr>
                ) : (
                  paginatedAgents.map((row) => {
                    const status = requestedAgents.get(row.agentId);
                    const isNotResolved = status === "Not Resolved";
                    const isResolved = status === "Resolved";
                    const disabled = !!status; // agar koi bhi status hai toh disable

                    const button = (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setSelectedAgentId(row.agentId);
                          setSelectedAgentEmail(row.userEmail);
                          setIsRequestModalOpen(true);
                        }}
                        disabled={disabled}
                      >
                        {isNotResolved
                          ? "Raised"
                          : isResolved
                          ? "Resolved"
                          : "Raise Request"}
                      </Button>
                    );

                    return (
                      <tr
                        key={row.agentId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-600">
                          {row.agentId}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {row.userName}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {row.userEmail}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {row.businessName}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {row.agentName}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {row.status === 1 ? (
                            <span className="text-green-600 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {row.agentPlan}
                        </td>
                        <td className="py-3 px-4">
                          <TooltipProvider>
                            {isNotResolved ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-block">{button}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Request already submitted
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              button
                            )}
                          </TooltipProvider>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + agentsPerPage, filteredAgents.length)} of{" "}
              {filteredAgents.length} agents
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        allUsers={usersList}
        onSubmit={(formData) => setIsAgentModalOpen(false)}
      />

      <RaiseAgentRequest
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        agentId={selectedAgentId}
        email={selectedAgentEmail}
        onSubmit={handleRaiseRequest} // API call happens after comment is entered
      />
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Agent</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to deactivate this agent:{" "}
            <strong>{selectedAgent?.agentName}</strong>?
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                selectedAgent && handleDeactivateAgent(selectedAgent)
              }
            >
              Deactivate
            </Button>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
