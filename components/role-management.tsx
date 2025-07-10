"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { RoleModal } from "./role-modal"
import { DeleteConfirmModal } from "./delete-confirm-modal"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const mockRoles: Role[] = [
  {
    id: "ROLE001",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["user.create", "user.read", "user.update", "user.delete", "role.manage", "system.config"],
    userCount: 2,
  },
  {
    id: "ROLE002",
    name: "Admin",
    description: "Administrative access with limited system configuration",
    permissions: ["user.create", "user.read", "user.update", "role.read"],
    userCount: 5,
  },
  {
    id: "ROLE003",
    name: "Agent",
    description: "Customer service agent with call handling permissions",
    permissions: ["call.handle", "customer.read", "customer.update"],
    userCount: 45,
  },
  {
    id: "ROLE004",
    name: "Manager",
    description: "Team management and reporting access",
    permissions: ["team.manage", "report.read", "user.read"],
    userCount: 8,
  },
]

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)

  const rolesPerPage = 10
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage)
  const startIndex = (currentPage - 1) * rolesPerPage
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + rolesPerPage)

  const handleAddRole = () => {
    setEditingRole(null)
    setIsModalOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setDeletingRole(role)
  }

  const confirmDelete = () => {
    if (deletingRole) {
      setRoles(roles.filter((r) => r.id !== deletingRole.id))
      setDeletingRole(null)
    }
  }

  const handleSaveRole = (roleData: Omit<Role, "id" | "userCount">) => {
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id ? { ...roleData, id: editingRole.id, userCount: editingRole.userCount } : r,
        ),
      )
    } else {
      const newRole: Role = {
        ...roleData,
        id: `ROLE${String(roles.length + 1).padStart(3, "0")}`,
        userCount: 0,
      }
      setRoles([...roles, newRole])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
        </div>
        <Button onClick={handleAddRole} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Roles</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Permissions</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Users</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRoles.map((role) => (
                  <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{role.id}</td>
                    <td className="py-3 px-4 font-medium">{role.name}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{role.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-blue-100 text-blue-800">{role.userCount}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + rolesPerPage, filteredRoles.length)} of{" "}
              {filteredRoles.length} roles
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        role={editingRole}
      />

      <DeleteConfirmModal
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={confirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deletingRole?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
