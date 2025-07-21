"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import Swal from "sweetalert2"

interface LoginPageProps {
  onLogin: (email: string, password: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentYear = new Date().getFullYear();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      Swal.fire("Error", "Please enter both email and password", "warning")
      return
    }

    setIsLoading(true)
    try {
      await onLogin(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in-50 duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-xl font-bold text-black">
              <img src="./logo.png" className="w-24 h-auto" alt="" />
            </div>

          </div>
          <p className="text-gray-600 text-lg">Partner Dashboard</p>
          <p className="text-gray-500 text-sm mt-1">The AI Receptionist Service</p>
        </div>
        <Card className="shadow-2xl border-0 animate-in slide-in-from-bottom-5 duration-700 delay-200">
          <CardHeader className="text-center pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your Partner dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@rexpt.com"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 animate-in fade-in-50 duration-700 delay-500">
       <p>© {currentYear} rexpt. All rights reserved.</p>
          <p className="mt-1">Secure admin access for AI receptionist management</p>
        </div>
      </div>
    </div>
  )
}
