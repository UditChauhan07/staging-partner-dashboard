"use client";

import React from "react";

type CallTestProps = {
  onStartCall: () => void;
  onEndCall: () => void;
  isCallActive: boolean;
  callLoading: boolean;
  setCallLoading: (value: boolean) => void;
  isliveTranscript: boolean;
  agentName?: string;
  agentAvatar?: string;
  businessName?: string;
  isEndingRef: React.MutableRefObject<boolean>;
};

const CallTest: React.FC<CallTestProps> = ({
  onStartCall,
  onEndCall,
  isCallActive,
  callLoading,
  setCallLoading,
  isliveTranscript,
  agentName,
  agentAvatar,
  businessName,
  isEndingRef,
}) => {
  const displayAgentName =
    agentName && agentName.length > 15 ? agentName.slice(0, 7) + "..." : agentName;

  const displayBusinessName = 'Partner'
    // businessName && businessName.length > 10 ? businessName.slice(0, 15) + "..." : businessName;

  const baseDivClasses =
    "w-full max-w-xs mx-auto rounded-xl flex flex-col items-center justify-center p-4 shadow-md";

  const iconTextLayout = "flex flex-row items-center space-x-4";

  const phoneIcon = (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-dark shadow-md"    
     style={{ background: isCallActive ? "red" : "green" }}
    >
      <img src="/svg/Phone-call.svg" alt="Phone Call" className="w-6 h-6" />
    </div>
  );
  console.log('isEndingRef.current', isEndingRef.current, isCallActive,callLoading);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <img
          src={agentAvatar || "/images/rex.png"}
          alt={agentName || "Agent"}
          className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
        />
      </div>

      {/* Disconnection State */}
      {/* dsds */}
      {isEndingRef.current ? (
        <div
          className={`${baseDivClasses} bg-red-100 cursor-not-allowed opacity-70 pointer-events-none`}
        >
          <div className={iconTextLayout}>
            {phoneIcon}
            <div>
              <p className="text-red-800 font-semibold">Disconnecting...</p>
              <small className="text-gray-700">{displayBusinessName} Agent is LIVE</small>
            </div>
          </div>
        </div>
      ) : isCallActive ? (
        <div className={`${baseDivClasses} bg-red-100`}>
          <div className={iconTextLayout} onClick={onEndCall}>
            {phoneIcon}
            <div  className="cursor-pointer">
              <p className="text-red-800 font-semibold">
                End Call <span className="text-sm text-black">{displayAgentName}</span>
              </p>
              <small className="text-gray-700">{displayBusinessName} Agent is LIVE</small>
            </div>
          </div>
        </div>
      ) : callLoading ? (
        <div
          className={`${baseDivClasses} bg-green-100 cursor-not-allowed opacity-70 pointer-events-none`}
        >
          <div className={iconTextLayout}>
            {phoneIcon}
            <div>
              <p className="text-green-800 font-semibold">Connecting...</p>
              <small className="text-gray-700">{displayBusinessName} Agent is LIVE</small>
            </div>
          </div>
          <div className="mt-2">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>

          </div>
        </div>
      ) : (
        <div
          className={`${baseDivClasses} bg-green-100 hover:bg-green-200 cursor-pointer transition`}
          onClick={onStartCall}
        >
          <div className={iconTextLayout}>
            {phoneIcon}
            <div>
              <p className="text-green-800 font-semibold">
                Call <span className="text-sm text-black">{displayAgentName}</span>
              </p>
              <small className="text-gray-700">{displayBusinessName} Agent is LIVE</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallTest;
