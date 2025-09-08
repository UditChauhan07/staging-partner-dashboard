"use client"
import {Users,LogOut, Menu, X, Headphones,Link2,Shield, UserCheck2, Grid2x2Check, Package, Coins, CoinsIcon ,Tickets,
  TvMinimalPlay,Presentation} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "recharts"
import { useEffect, useState } from "react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onLogout?: () => void
}

const navigationItems = [
  {id:"analytics",label:"Dashboard",icon:Grid2x2Check},
  { id: "users", label: "Customer Management", icon: Users },
  { id: "agents", label: "Agent Business List", icon: Headphones },
  
  {id:"EarningsTable", label:"Partner Earnings",icon:CoinsIcon },
  { id: "referral", label: "Marketing Material", icon: Link2 },
  {id:"Ownagent",label:"Partner agent",icon:UserCheck2},
  {id:"ProfileDetails",label:"Profile Details",icon:Shield},
  {id:"RaiseTickets",label:"Raise Ticket",icon:Tickets},
  { id: "PartnerResources", label: "Partner Resources", icon: TvMinimalPlay },
  { id: "Demo", label: "Demo", icon: Presentation  },



]


export function Sidebar({ activeSection, onSectionChange, isCollapsed, onToggleCollapse, onLogout }: SidebarProps) {
    console.log(isCollapsed)

useEffect(() => {
    // Only run on mount to set initial state based on screen size
    const handleInitialResize = () => {
      console.log('init run',window.innerWidth)
      if (window.innerWidth <= 768 && !isCollapsed) {
        onToggleCollapse();
      } else if (window.innerWidth > 768 && isCollapsed) {
        onToggleCollapse();
      }
    };

    handleInitialResize(); // Run on mount only

    // No resize event listener needed to override user choice
  }, [])
  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-black">
              <img src="./logo.png" className="w-24 h-auto" alt="" />
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              style={{padding:"6px"}}
              onClick={() => onSectionChange(item.id)}
          
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === item.id
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}
