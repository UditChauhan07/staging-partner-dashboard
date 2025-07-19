"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeLoader } from "react-spinners"
import { Badge } from "@/components/ui/badge"

interface CommissionEntry {
  id: number
  userId: string
  name: string
  email: string
  agentName: string
  planName: string
  commissionAmount: number
  currency: string
  agentstatus: string
  commissionMonth:string
}

export default function EarningsTable() {
  const [commissions, setCommissions] = useState<CommissionEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const getReferralUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`
      )
      const result = await res.json()
      console.log(result)

      if (result?.status === true) {
        const rawData = result?.commissions || []

        const mapped: CommissionEntry[] = rawData.map((entry: any) => ({
          id: entry.id,
          userId: entry.referredUser?.userId,
          name: entry.referredUser?.name || "Unknown",
          email: entry.referredUser?.email || "N/A",
          agentName: entry.agentDetails?.agentName || "N/A",
          planName: entry.planName || "N/A",
          commissionAmount: parseFloat(entry.commissionAmount) || 0,
          currency: entry.currency || "₹",
          agentstatus: entry.agentStatus ||"",
          commissionMonth:entry.commissionMonth||"N/A"
        }))

        setCommissions(mapped)
      }
    } catch (err: any) {
      console.error("Fetch error:", err)
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) getReferralUsers()
  }, [userId])


function formatCommissionMonth(monthStr: string) {
  const date = new Date(`${monthStr}-01`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
  });
}



  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white bg-opacity-50 z-50">
        <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">⚠️ {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-gray-600 mt-2">Referral commission earnings breakdown</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral Earning Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 ">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission Month</th>

                </tr>
              </thead>
              <tbody>
                {commissions.length > 0 ? (
                  commissions.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{entry.userId}</td>
                      <td className="py-3 px-4 font-medium">{entry.name}</td>
                      <td className="py-3 px-4 text-gray-600">{entry.email}</td>
                      <td className="py-3 px-4 text-gray-600">{entry.agentName}</td>
                      <td className="py-3 px-4 text-gray-600">{entry.planName}</td>
                      <td className="py-3 px-4">{entry.agentstatus}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        {entry.currency}{" "}
                        {entry.commissionAmount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-green-600">  {formatCommissionMonth(entry.commissionMonth)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No commission data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
