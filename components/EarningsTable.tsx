"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeLoader } from "react-spinners"

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
  commissionMonth: string
}

export default function EarningsTable() {
  const [commissions, setCommissions] = useState<CommissionEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedMonth, setSelectedMonth] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [sortField, setSortField] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc")
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("");


  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const getReferralUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`
      )
      const result = await res.json()

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
          agentstatus: entry.agentStatus || "",
          commissionMonth: entry.commissionMonth || "N/A",
        }))

        setCommissions(mapped)

        const months = new Set<string>()
        const years = new Set<string>()

        rawData.forEach((entry: any) => {
          if (entry.commissionMonth) {
            const [year, month] = entry.commissionMonth.split("-")
            months.add(month)
            years.add(year)
          }
        })

        setAvailableMonths(Array.from(months))
        setAvailableYears(Array.from(years))
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
    const date = new Date(`${monthStr}-01`)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const filteredAndSorted = commissions
  .filter((entry) => {
    const [year, month] = entry.commissionMonth.split("-")
    const matchesMonth = selectedMonth === "All" || selectedMonth === month
    const matchesYear = selectedYear === "All" || selectedYear === year

    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      entry.name.toLowerCase().includes(searchLower) ||
      entry.email.toLowerCase().includes(searchLower) ||
      entry.agentName.toLowerCase().includes(searchLower)

    return matchesMonth && matchesYear && matchesSearch
  })
  .sort((a, b) => {
    if (!sortField) return 0
    const aValue = (a as any)[sortField]
    const bValue = (b as any)[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })


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
          <p className="text-gray-600 mt-2">
            Referral commission earnings breakdown
          </p>
        </div>
      </div>

      {/* Filters and Sorting */}
     


      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex">
          <CardTitle>Earning List </CardTitle> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <div className="flex flex-wrap gap-4 items-center">
        <div className="flex" style={{alignItems: "center"}}>
          <label className="text-sm text-gray-600">Filter by Month&nbsp;</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block border rounded px-2 py-1 text-sm"
          >
            <option value="All">All</option>
            {availableMonths.sort().map((m) => (
              <option key={m} value={m}>
                {new Date(`2023-${m}-01`).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex"  style={{alignItems: "center"}}>
          <label className="text-sm text-gray-600">Filter by Year&nbsp;</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block border rounded px-2 py-1 text-sm"
          >
            <option value="All">All</option>
            {availableYears.sort().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex"  style={{alignItems: "center"}}>
          <label className="text-sm text-gray-600">Sort By &nbsp;</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="block border rounded px-2 py-1 text-sm"
          >
            <option value="">None</option>
            <option value="name">User Name</option>
            <option value="agentName">Agent Name</option>
            <option value="commissionAmount">Commission Amount</option>
            <option value="planName">Plan</option>
          </select>
        </div>

        {/* {sortField && (
          <button
            className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200" style={{marginTop:'20px',display:'flex'}}
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "dsc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        )} */}
        <div style={{position:'absolute',right:'26px'}}>
  {/* <label className="text-sm text-gray-600">Search</label> */}
  <input
    type="text"
    placeholder="Search name, email, agent..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="block border rounded px-2 py-1 text-sm"
  />
</div>

      </div>
      </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Agent Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Agent Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Commission Month
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.length > 0 ? (
                  filteredAndSorted.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
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
                      <td className="py-3 px-4 font-semibold text-green-600">
                        {formatCommissionMonth(entry.commissionMonth)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
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
