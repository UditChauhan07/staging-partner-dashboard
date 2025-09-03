"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { UserModal } from "./user-modal";
import { RaiseRequestModal } from "./raiserequest";
import {
  retrieveAllRegisteredUsers,
  addUser,
  deleteUser,
  raiseRequest,
  checkUserRequestStatus,
} from "@/Services/auth";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
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
  registrationDate: string;
  phone: string;
  referredBy?: string;
  isUserType?: number;
  role?: number | null;
  referralCode?: string;
  referalName?: string;
}

interface UserManagementProps {
  onViewUser: (user: User) => void;
}

export function UserManagement({ onViewUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [requestedUsers, setRequestedUsers] = useState<
    Map<string, string | null>
  >(new Map());
  const [requestingUserId, setRequestingUserId] = useState<string | null>(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );

  const usersPerPage = 20;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const apiUsers = await retrieveAllRegisteredUsers();
      if (!Array.isArray(apiUsers)) return;
      const mappedUsers: User[] = apiUsers.map((u: any, index: number) => ({
        id: u.userId ?? `USR${String(index + 1).padStart(3, "0")}`,
        name: u.name ?? "N/A",
        email: u.email ?? "No Email",
        registrationDate: u.createdAt ?? "",
        phone: u.phone ?? "N/A",
        referredBy: u.referredBy,
        isUserType: u.isUserType,
        referralCode: u.referralCode ?? "N/A",
        referalName: u.referredByName ?? "N/A",
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch requested users
  useEffect(() => {
    const fetchRequestedUsers = async () => {
      try {
        const updatedRequestedUsers = new Map<string, string | null>();
        for (const user of users) {
          const data = await checkUserRequestStatus(user.id);
          if (typeof data === "boolean") {
            if (data) updatedRequestedUsers.set(user.id, "Not Resolved");
          } else if (data?.alreadyRequested) {
            updatedRequestedUsers.set(user.id, data.Status || "Not Resolved");
          }
        }
        setRequestedUsers(updatedRequestedUsers);
      } catch (err) {
        console.error(err);
      }
    };
    if (users.length) fetchRequestedUsers();
  }, [users]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleRaiseRequest = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmit = async (
    comment: string,
    userId: string,
    email: string
  ) => {
    try {
      setRequestingUserId(userId);
      const res = await raiseRequest({ userId, email, comment });
      if (res?.status) {
        Swal.fire({
          icon: "success",
          title: "Request Raised",
          timer: 1500,
          showConfirmButton: false,
        });
        setRequestedUsers((prev) => new Map(prev.set(userId, "Not Resolved")));
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to raise request.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    } finally {
      setRequestingUserId(null);
    }
  };

  const handleSaveUser = async (userData: Omit<User, "id">) => {
    setIsSaving(true);
    try {
      const payload: any = { ...userData, role: null };
      if (editingUser?.id) payload.id = editingUser.id;
      const response = await addUser(payload);
      if (response?.status) {
        fetchUsers();
        Swal.fire({
          icon: "success",
          title: editingUser ? "User updated" : "User created",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response?.data?.error || "Error saving user",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
      setEditingUser(null);
    }
  };

  // Filter, sort, paginate
  const currentReferredBy =
    typeof window !== "undefined" ? localStorage.getItem("referralCode") : null;
  const filteredUsers = users
    .filter((u) => u.referredBy === currentReferredBy && u.isUserType === 0)
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all platform users
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New User
        </Button>
      </div>

      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/50 z-50">
          <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
        </div>
      ) : (
        <Card>
          <CardHeader />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      "User ID",
                      "Name",
                      "Email",
                      "Phone Number",
                      "Referred By",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => {
                      const isRequestDone =
                        requestedUsers.get(user.id) === "Not Resolved" ||
                        requestedUsers.get(user.id) === "Resolved" ||
                        requestingUserId === user.id;
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-mono text-sm">
                            {user.id}
                          </td>
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.email}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.phone}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.referredBy}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onViewUser(user)}
                                disabled={isRequestDone}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                                disabled={isRequestDone}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-blue-600 hover:text-blue-700"
                                        onClick={() =>
                                          handleRaiseRequest(
                                            user.id,
                                            user.email
                                          )
                                        }
                                        disabled={isRequestDone}
                                      >
                                        {requestingUserId === user.id ? (
                                          <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                                        ) : requestedUsers.get(user.id) ===
                                          "Not Resolved" ? (
                                          "Raised"
                                        ) : requestedUsers.get(user.id) ===
                                          "Resolved" ? (
                                          "Resolved"
                                        ) : (
                                          "Raise Request"
                                        )}
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  {requestedUsers.get(user.id) ===
                                    "Not Resolved" && (
                                    <TooltipContent>
                                      Request already submitted
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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
                {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
      )}

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
        isSaving={isSaving}
      />
      <RaiseRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        userId={selectedUserId}
        email={selectedUserEmail}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}
