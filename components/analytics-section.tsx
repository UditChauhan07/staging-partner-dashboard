"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FadeLoader } from "react-spinners"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import getSymbolFromCurrency from 'currency-symbol-map'

export function AnalyticsSection() {
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalAgents: 0 })
  const [loading, setLoading] = useState(true)
  const [earning, setTotalEarning] = useState(0)
  const [commissionChartData, setCommissionChartData] = useState([])
  const [currency,setCurrency]=useState()

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const referralCode = typeof window !== "undefined" ? localStorage.getItem("referralCode") : null

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        if (!referralCode) throw new Error("Referral Code not found in local storage.")

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneranalytics/${referralCode}`
        )

        const data = response.data
        setAnalytics({
          totalUsers: data.totalUsers || 0,
          totalAgents: data.totalAgents || 0,
        })
      } catch (err: any) {
        console.error("Error fetching analytics:", err)
        Swal.fire("Error", err.message || "Something went wrong", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [referralCode])

const getReferralUsers = async () => {
  setLoading(true)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`
    )
    const result = await res.json()

    if (result?.status === true) {
      setTotalEarning(result?.totalEarnings)
      setCurrency(result?.commissions[0]?.currency)
      const monthlyTotals: Record<string, number> = {}
      result.commissions.forEach((entry: any) => {
        const key = entry.commissionMonth
        const amount = parseFloat(entry.commissionAmount || 0)
        monthlyTotals[key] = (monthlyTotals[key] || 0) + amount
      })

      const today = new Date()
      const currentYear = today.getFullYear()

      const months: { name: string; amount: number }[] = []
      for (let m = 0; m < 12; m++) {
        const date = new Date(currentYear, m, 1) // Corrected day to 1
        const monthKey = `${currentYear}-${String(m + 1).padStart(2, "0")}`
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })

        months.push({
          name: label,
          amount: parseFloat((monthlyTotals[monthKey] || 0).toFixed(2)),
        })
      }

      setCommissionChartData(months)
    }
  } catch (err) {
    console.error("Fetch error:", err)
  } finally {
    setLoading(false)
  }
}




  useEffect(() => {
    if (userId) getReferralUsers()
  }, [userId])
function formatCurrency(amount: any, currency?: string) {
  const numAmount = Number(amount); // convert to number

  if (isNaN(numAmount)) return ""; // avoid showing "NaN" or error

  if (!currency || currency === "undefined" || currency === "null") {
    return numAmount.toFixed(2); // e.g. "0.00"
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(numAmount);
  } catch (e) {
    return numAmount.toFixed(2); // fallback
  }
}


  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="animate-in slide-in-from-left-5 duration-700">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform's key metrics</p>
      </div>
<br/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : (
          <>
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Referred Users
                </CardTitle>
              </CardHeader>
              <div className="text-3xl font-bold text-gray-900 flex justify-center items-center h-12">
                {analytics.totalUsers}
              </div>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Agents from Referred Users
                </CardTitle>
              </CardHeader>
              <div className="text-3xl font-bold text-gray-900 flex justify-center items-center h-12">
                {analytics.totalAgents}
              </div>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg hover:scale-105 transition-all duration-300 col-span-2" >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Earnings from Referred Users
                </CardTitle>
              </CardHeader>
            <CardContent>
  <div className="text-3xl font-bold text-gray-900 flex justify-center items-center h-12">
    {formatCurrency(earning ?? 0, currency)}
  </div>
</CardContent>


            </Card>
          </>
        )}
      </div>
      <br/>

      {/* Chart Section */}
      <Card className="border-l-4 border-l-purple-500 " style={{margin:'25px 3px 3px 3px'}}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Monthly Commission Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FadeLoader height={10} width={3} color="#6524EB
" speedMultiplier={1.5} />
            </div>
          ) : (
            <div className="w-full h-64">
              <ResponsiveContainer width="95%" height="100%">
                <LineChart data={commissionChartData}>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodColor="#6524EB
"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6524EB
"
                    strokeWidth={2}
                    dot={false}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
