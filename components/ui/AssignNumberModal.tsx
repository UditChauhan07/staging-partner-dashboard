"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { updateAgent } from "@/Services/auth";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
import ClipLoader from "react-spinners/ClipLoader";

const AssignNumberModal = ({
  isOpen,
  onClose,
  agentId,
  onCallApi,
  agentDetails,
  onAssignNumber,
  onAgentDetailsPage,
}) => {
  const [loading, setLoading] = useState(false);
  const [areaCode, setAreaCode] = useState();
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
    // console.log(agentDetails, "agentDetails");
  const handleAssignNumber = async () => {
    try {   
      if (isSubmitting) return;
      setLoading(true);
      setIsSubmitting(true);

      const payload = {
        inbound_agent_id: agentId,
        outbound_agent_id: agentId,
        inbound_agent_version: 0,
        outbound_agent_version: 0,
        area_code: parseInt(areaCode) || 406,
        number_provider: "twilio",
      };

       const response= await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/assignNumberToAgent?agentId=${agentId}`,
        { payload } // ⬅️ this wraps payload inside an object
        );    //   const response = await axios.post(
    //     "https://api.retellai.com/create-phone-number",
    //     payload,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // console.log(response);
      if(response.data.status == true) {
        const phoneNumber = response?.data?.phone_number;

      Swal.fire(`Number ${phoneNumber} assigned!`);
      if (onAgentDetailsPage) onAssignNumber();
    }
} catch (error) {
      console.error("Error assigning number:", error.response?.data || error.message);
      Swal.fire("Error",error?.response?.data?.message || "Error assigning number",'error');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      const businessDetails = agentDetails?.business || agentDetails;
      setAreaCode(businessDetails.area_code);
    } catch (err) {
      console.error("Failed to parse phone JSON:", err);
    }
  }, [agentDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
          disabled={loading || isSubmitting}
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-center text-[#5a20d8] mb-2">Assign a New Number</h2>

        <p className="text-sm text-gray-800 mb-4">
          <strong className="text-[#5a20d8]">Disclaimer:</strong> You will not be able to change
          this number before <strong>25 days</strong>.
        </p>

        <p className="text-sm font-semibold mb-2">You will be able to use this number as below:</p>

        <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1">
          <li>1. Provide this number as your inbound support number.</li>
          <li>2. Forward calls from your current support number to this Rexpt.in number.</li>
        </ul>

        <div
          className={`w-full ${loading || isSubmitting ? "pointer-events-none opacity-60" : ""}`}
        >
          <button
            className="bg-[#5a20d8] text-white w-full py-2 rounded-lg text-sm font-semibold hover:bg-[#4a1ab3] transition flex items-center justify-center"
            onClick={handleAssignNumber}
            disabled={loading || isSubmitting}
          >
            {loading ? (
            <div className="flex items-center gap-2">
                <ClipLoader size={22}  color="#ffffffff" />
                <span>Assigning...</span>
                </div>
            ) : (
              "Assign Number"
            )}
          </button>
        </div>

        <p className="text-xs mt-4 text-center text-gray-500">
          ✨ <strong>Coming Soon:</strong> We will provide option to choose your custom new support
          number.
        </p>
      </div>


    </div>
  );
};

export default AssignNumberModal;
