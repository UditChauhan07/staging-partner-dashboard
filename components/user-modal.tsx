"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
interface User {
  id: string
  name: string
  email: string
  phone: string
}
interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: Omit<User, "id">) => void
  user?: User | null
  isSaving?: boolean;
}
export function UserModal({ isOpen, onClose, onSave, user, isSaving }: UserModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    } else {
      setFormData({ name: "", email: "", phone: "" })
    }
    setErrors({})
  }, [user, isOpen])
  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (formData.name.trim() && !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must only contain letters and spaces"
    }
    if (formData.phone.trim() && !/^\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 7 to 15 digits"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = (e: React.FormEvent) => {
    if (isSaving) return;
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{user ? "Edit User" : "Add New User"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled={user}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white animate-spin rounded-full"></div>
                  Saving...
                </div>
              ) : user ? "Update User" : "Create User"}
            </Button>

            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
