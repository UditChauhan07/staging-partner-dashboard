"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  retrieveAllRegisteredUsers2,
  deleteAgent,
  deactivateAgent,
  fetchAgentDetailById,
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
import { retrieveAllRegisteredUsers } from "@/Services/auth";
import { FadeLoader } from "react-spinners";

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
    total_call: any
  ) => void; // ✅ Accepts both agent & business
}
export function AgentBusinessList({ onViewAgent }: AgentBusinessListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [agentData, setAgentData] = useState<AgentBusinessRow[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentBusinessRow | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [usersList, setuserList] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [loaders, setLoaders] = useState(false);
  
const [statusFilter, setStatusFilter] = useState("All");
const [planFilter, setPlanFilter] = useState("All");
const [sortField, setSortField] = useState("");
const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc");

  console.log(selectedAgent, "selectedAgent");

  async function fetchUsers() {
    try {
      setLoaders(true);
      const referredBy =
        typeof window !== "undefined"
          ? localStorage.getItem("referralCode")
          : null;
      const apiUsers = await retrieveAllRegisteredUsers();
      if (!Array.isArray(apiUsers)) {
        console.error("API returned error:", apiUsers);
        return;
      }
      console.log(apiUsers, "response of agents");
      console.log(apiUsers.length, "dff");
      const filteredUsers = apiUsers.filter(
        (u: any) => u.referredBy === referredBy
      );

      const mappedUsers: User[] = apiUsers.map((u: any, index: number) => ({
        id: u.userId ?? `USR${String(index + 1).padStart(3, "0")}`,
        name: u.name ?? "N/A",
        email: u.email ?? "No Email",
        phone: u.phone ?? "N/A",
        referredBy:u.referredBy??"N/A"
      }));
      console.log(mappedUsers, "mappedUsers");
      setuserList(mappedUsers);
      setLoaders(true);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoaders(false);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchData = async () => {
    setLoaders(true);
    const referredBy =
      typeof window !== "undefined"
        ? localStorage.getItem("referralCode")
        : null;
    const res = await retrieveAllRegisteredUsers2();
    console.log(res.length, "response of agents");
    const flatList: AgentBusinessRow[] = [];

    res?.data?.forEach((user: any) => {
      if (user.referredBy !== referredBy) return; //
      user.businesses?.forEach((business: any) => {
        if (!business || !business.agents) return;

        business.agents.forEach((agent: any) => {
          if (!agent) return;
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
  };
  useEffect(() => {
    fetchData();
  }, []);

  const agentsPerPage = 10;
 const filteredAgents = agentData
  .filter((row) => {
    const name = row.agentName || "";
    const business = row?.businessName || "";
    const user = row.userName || "";
    const email = row.userEmail || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

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
  console.log(paginatedAgents)
  const handleDeleteClick = (agent: AgentBusinessRow) => {
    setSelectedAgent(agent);
    setShowConfirm(true);
  };

  // const handleConfirmDelete = async () => {
  //   if (!selectedAgent) return;

  //   Swal.fire({
  //     title: "Deleting...",
  //     text: "Please wait while we delete the agent.",
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });

  //   try {
  //     setLoading(true);
  //     await deleteAgent(selectedAgent.agentId);
  //     setAgentData((prev) =>
  //       prev.filter((agent) => agent.agentId !== selectedAgent.agentId)
  //     );
  //     setLoading(false);
  //     Swal.close();
  //     await fetchData();
  //     await Swal.fire({
  //       icon: "success",
  //       title: "Agent deleted",
  //       text: `${selectedAgent.agentName} has been removed successfully.`,
  //       confirmButtonColor: "#5a1fc0",
  //     });
  //   } catch (err) {
  //     console.error("Failed to delete agent:", err);
  //     Swal.close();
  //     await Swal.fire({
  //       icon: "error",
  //       title: "Deletion failed",
  //       text: "Something went wrong while deleting the agent.",
  //       confirmButtonColor: "#e02424",
  //     });
  //   } finally {
  //     setIsDeleting(false);
  //     setShowConfirm(false);
  //     setSelectedAgent(null);
  //   }
  // };

  const handleDeactivateAgent = async (agent: AgentBusinessRow) => {
    if (!agent) return;

    const result = await Swal.fire({
      title: "Deactivate Agent?",
      text: `Are you sure you want to deactivate agent "${agent.agentName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#eab308",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deactivating...",
        text: "Please wait while we deactivate the agent.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        setLoading(true);
        const response = await deactivateAgent(agent.agentId);
        Swal.close();
        await fetchData();
        if (response?.status === true) {
          setLoading(false);
          await Swal.fire({
            icon: "success",
            title: "Agent Deactivated",
            text: `${agent.agentName} has been successfully deactivated.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } 
      } catch (err) {
        console.error("Error deactivating agent:", err);
        setLoading(false);
        Swal.close();
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while deactivating the agent.",
        });
      } finally {
        setShowConfirm(false);
        setSelectedAgent(null);
      }
    }
  };

  const handleAgentClick = async (row: AgentBusinessRow) => {
    try {
      setLoading(true);
      const { agentId, businessId } = row;
      console.log(row);
      const data = await fetchAgentDetailById({
        agentId,
        bussinesId: businessId,
      });
      console.log("dsdsdsdsdsdewrerrewrew", data);
      onViewAgent(
        data?.data?.agent,
        data?.data?.business,
        data?.data?.knowledge_base_texts
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching agent details", err);
      setLoading(false);
    }
  };
  if (loading) {
    console.log("reachedHere");
    return (
      <div
        style={{
          position: "fixed", // ✅ overlay entire screen
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)", // ✅ 50% white transparent
          zIndex: 9999, // ✅ ensure it's on top
        }}
      >
        <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Agent Business List
          </h1>
          <p className="text-gray-600 mt-2">
            Manage agents across all businesses
          </p>
        </div>
        <div>
          {" "}
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setIsAgentModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Agent
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Agents</CardTitle>

          
            <div className="flex gap-4 mt-4">
  <div>
    <label className="text-sm text-gray-600">Status &nbsp;</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="mt-1 border rounded px-2 py-1 text-sm"
    >
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-600">Plan &nbsp;</label>
    <select
      value={planFilter}
      onChange={(e) => setPlanFilter(e.target.value)}
      className="mt-1 border rounded px-2 py-1 text-sm"
    >
      <option value="All">All</option>
      {[...new Set(agentData.map((a) => a.agentPlan))].map((plan) => (
        <option key={plan} value={plan}>
          {plan}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="text-sm text-gray-600">Sort By &nbsp;</label>
    <select
      value={sortField}
      onChange={(e) => setSortField(e.target.value)}
      className="mt-1 border rounded px-2 py-1 text-sm"
    >
      <option value="">None</option>
      <option value="agentName">Agent Name</option>
      <option value="userName">User Name</option>
      <option value="agentPlan">Plan</option>
    </select>
  </div>

  {sortField && (
    <div className="flex items-end">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "dsc" : "asc"))
        }
      >
        {sortOrder === "asc" ? "↑ ASC" : "↓ DSC"}
      </Button>
    </div>
  )}
    <div className="relative w-30">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  w-4" /> */}
              <Input
                placeholder="Search agents or businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block border rounded px-2 py-1 text-sm h-8" 
              />
            </div>
</div>

          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    AgentID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    User Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Business Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Agent Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Agent Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {" "}
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loaders ? (
                  <tr>
                    <td colSpan={8}>
                      <div
                        className="flex justify-center items-center py-6 "
                        style={{ marginTop: "25%", marginBottom: "50%" }}
                      >
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
                  paginatedAgents.map((row) => (
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
                      <td className="py-3 px-4 font-medium">{row.agentName}</td>
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
                      {/* <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentClick(row)}
                          className="hover:bg-purple-50 hover:text-purple-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td> */}
                      <td>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(row)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
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

      <AddAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false);
          setUserSearch("");
        }}
        allUsers={usersList} // 🔄 list of all users for step 1 dropdown
        onSubmit={(formData) => {
          console.log("Final Form Data:", formData);
          // 🚀 Call your backend API here
          setIsAgentModalOpen(false); // close modal after submit
        }}
      />
      {/* delete agent dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Agent</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this agent:{" "}
            <strong>{selectedAgent?.agentName}</strong>?
          </p>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            {/* <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button> */}
            <Button
              variant="outline"
              onClick={() => {
                if (!selectedAgent) return;
                setShowConfirm(false);
                handleDeactivateAgent(selectedAgent);
              }}
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
