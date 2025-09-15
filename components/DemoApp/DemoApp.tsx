"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DemoAppProps {
  onSessionGenerated: () => void;
}

export default function DemoApp({ onSessionGenerated }: DemoAppProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleStartDemo = async () => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/demoApp/generate-demoSessionId?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent('Partner')}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { encryptedPayload, signature } = res.data;

      if (!encryptedPayload || !signature) {
        setError("Session generation failed");
        setLoading(false);
        return;
      }

      const signupUrl = `${process.env.NEXT_PUBLIC_DEMO_APP_URL}?sessionId=${encodeURIComponent(encryptedPayload)}&signature=${encodeURIComponent(signature)}`;

      window.open(signupUrl, "_blank");

      // onSessionGenerated();  // Go back to dashboard

    } catch (err) {
      console.error(err);
      setError("Failed to generate demo session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6 md:mb-8">
        Start Demo Session
      </h1>

      {error && (
        <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg text-center">
          {error}
        </p>
      )}

      <Button
        onClick={handleStartDemo}
        disabled={loading}
        className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg md:text-xl font-medium bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" /> Starting Demo...
          </div>
        ) : (
          "Start Demo"
        )}
      </Button>

      <p className="text-gray-500 mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-center max-w-xs sm:max-w-md md:max-w-lg">
        Click the button above to launch the demo application in a new tab.
      </p>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";  // Assuming you're using a styled button component
// import { Loader2 } from "lucide-react";

// interface DemoAppProps {
//   onSessionGenerated: () => void;
// }

// export default function DemoApp({ onSessionGenerated }: DemoAppProps) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   const handleStartDemo = async () => {
//     if (!userId) {
//       setError("User not logged in");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/demoApp/generate-demoSessionId?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent('Partner')}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       const { encryptedPayload, signature } = res.data;

//       if (!encryptedPayload || !signature) {
//         setError("Session generation failed");
//         setLoading(false);
//         return;
//       }

//       const signupUrl = `${process.env.NEXT_PUBLIC_DEMO_APP_URL}?sessionId=${encodeURIComponent(encryptedPayload)}&signature=${encodeURIComponent(signature)}`;

//       window.open(signupUrl, "_blank");

//       // onSessionGenerated();  // Go back to dashboard

//     } catch (err) {
//       console.log(err)
//       console.error(err);
//       setError("Failed to generate demo session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 ">
//       <h1 className="text-3xl font-semibold text-gray-800 mb-6">Start Demo Session</h1>

//       {error && (
//         <p className="text-red-600 mb-4">{error}</p>
//       )}

//       <Button
//         onClick={handleStartDemo}
//         disabled={loading}
//         className="px-6 py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700"
//       >
//         {loading ? (
//           <div className="flex items-center gap-2">
//             <Loader2 className="animate-spin h-5 w-5" /> Starting Demo...
//           </div>
//         ) : (
//           "Start Demo"
//         )}
//       </Button>

//       <p className="text-gray-500 mt-4 text-center">
//         Click the button above to launch the demo application in a new tab.
//       </p>
//     </div>
//   );
// }
// 