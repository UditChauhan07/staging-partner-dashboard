"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsSection() {
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalAgents: 0 });
  const [loading, setLoading] = useState(true);
  const [earning,settotalEarning]=useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      try {
        // Get userId from localStorage or wherever you're storing it
        const userId = localStorage.getItem("referralCode");

        if (!userId) {
          throw new Error("User ID not found in local storage.");
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneranalytics/${userId}`);
        const data = response.data;

        setAnalytics({
          totalUsers: data.totalUsers || 0,
          totalAgents: data.totalAgents || 0,
        });
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        Swal.fire("Error", err.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
const getReferralUsers = async () => {
    setLoading(true)
    

    try {
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`
      )
      const result = await res.json()
      console.log(result)

      if (result?.status === true) {
        settotalEarning(result.totalEarnings)
      }
    } catch (err: any) {
      console.error("Fetch error:", err)
    
    } finally {
      setLoading(false)
    }
  }
  const userId=localStorage.getItem("userId")

  useEffect(() => {
    if (userId) getReferralUsers()
  }, [userId])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="animate-in slide-in-from-left-5 duration-700">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform's key metrics</p>
      </div>

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
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Agents from Referred Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{analytics.totalAgents}</div>
              </CardContent>
            </Card>



            <br/>
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 " >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Earning from Referred Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{earning}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
