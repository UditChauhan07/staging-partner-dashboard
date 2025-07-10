"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (role: Omit<Role, "id" | "userCount">) => void
  role?: Role | null
}

const availablePermissions = [
  { id: "user.create", label: "Create Users", category: "User Management" },
  { id: "user.read", label: "View Users", category: "User Management" },
  { id: "user.update", label: "Edit Users", category: "User Management" },
  { id: "user.delete", label: "Delete Users", category: "User Management" },
  { id: "role.create", label: "Create Roles", category: "Role Management" },
  { id: "role.read", label: "View Roles", category: "Role Management" },
  { id: "role.update", label: "Edit Roles", category: "Role Management" },
  { id: "role.delete", label: "Delete Roles", category: "Role Management" },
  { id: "call.handle", label: "Handle Calls", category: "Call Management" },
  { id: "call.monitor", label: "Monitor Calls", category: "Call Management" },
  { id: "report.read", label: "View Reports", category: "Reporting" },
  { id: "report.create", label: "Create Reports", category: "Reporting" },
  { id: "system.config", label: "System Configuration", category: "System" },
  { id: "team.manage", label: "Manage Teams", category: "Team Management" },
]

export function RoleModal({ isOpen, onClose, onSave, role }: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: [],
      })
    }
  }, [role, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId],
      })
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permissionId),
      })
    }
  }

  const groupedPermissions = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof availablePermissions>,
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{role ? "Edit Role" : "Add New Role"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="mt-2 space-y-4 max-h-60 overflow-y-auto border rounded-lg p-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <div className="space-y-2 ml-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              {role ? "Update Role" : "Create Role"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
