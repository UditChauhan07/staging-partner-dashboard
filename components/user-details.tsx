"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, Clock, Shield } from "lucide-react"
interface User {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Inactive" | "Suspended"
  lastLogin: string
  registrationDate?: string
  phone: string
  referredBy: string
  referralCode: string
}

interface UserDetailsProps {
  user: User
  onBack: () => void
}
export function UserDetails({ user, onBack }: UserDetailsProps) {
  console.log(user, "user")
  const getStatusBadge = (status: User["status"]) => {
    const variants = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      Suspended: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-1">Complete information for {user.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <div className="flex justify-center mt-2">{getStatusBadge("Active")}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email || "--"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{user?.phone || "--"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">{user.role || "User"}</span>
            </div>

          </CardContent>
        </Card>
        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="mt-1 text-gray-900 font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="mt-1 text-gray-900">{user?.email || "--"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <p className="mt-1 text-gray-900">{user?.phone || "--"}</p>
                </div>
                  <div>
                  <label className="text-sm font-medium text-gray-500">Referral code</label>
                  <p className="mt-1 text-gray-900">{user?.referralCode || "--"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referred By</label>
                  <p className="mt-1 text-gray-900">{user?.referredBy || "--"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">{getStatusBadge("Active")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Activity Information */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900">
                      {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-gray-900">{user.lastLogin}</p>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
