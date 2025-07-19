import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function ReferralLink() {
  const [fullLink, setFullLink] = useState("");

  useEffect(() => {
    const code = localStorage.getItem("referralCode") || "";
    const referralname=localStorage.getItem('referralName')
    setFullLink(`https://refer.rxpt.us/${referralname}`);
  }, []);

  const copyToClipboard = async () => {
    if (!fullLink) return;
    try {
      await navigator.clipboard.writeText(fullLink);
      toast.success("Partner Referral link copied!");
    } catch {
      toast.error("Failed to copy. Try again.");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Full-screen purple backdrop */}
      <div
        className="
          flex-1 flex items-center justify-center p-4 overflow-hidden my-5"
      >
        {/* Wider card */}
        <div
          className="
            bg-white rounded-2xl shadow-xl
            p-8
            max-w-3xl         
            w-full
          "
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Share Your Partner Referral Link
          </h2>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={fullLink}
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3 pr-12 text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition
                "
              />
              <Copy       onClick={copyToClipboard} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
            </div>

            {/* <Button
              onClick={copyToClipboard}
              className="
                bg-purple-600 text-white
                hover:bg-purple-700
                focus:ring-2 focus:ring-purple-500
                transition
              "
            >
              Copy
            </Button> */}
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Invite friends and earn rewards 🎉
          </p>
        </div>
      </div>
    </>
  );
}
