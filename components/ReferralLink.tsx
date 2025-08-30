// import React, { useState, useEffect } from "react";
// import { Copy } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { Button } from "@/components/ui/button";

// export function ReferralLink() {
//   const [fullLink, setFullLink] = useState("");

//   useEffect(() => {
//     const code = localStorage.getItem("referralCode") || "";
//     const referralname=localStorage.getItem('referralName')
//     setFullLink(`https://refer.rxpt.us/${referralname}`);
//   }, []);

//   const copyToClipboard = async () => {
//     if (!fullLink) return;
//     try {
//       await navigator.clipboard.writeText(fullLink);
//       toast.success("Partner Referral link copied!");
//     } catch {
//       toast.error("Failed to copy. Try again.");
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-right" />

//       {/* Full-screen purple backdrop */}
//       <div
//         className="
//           flex-1 flex items-center justify-center p-4 overflow-hidden my-5"
//       >
//         {/* Wider card */}
//         <div
//           className="
//             bg-white rounded-2xl 
//             p-8
//             max-w-3xl         
//             w-full
//           "
//         >
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//             Share Your Partner Referral Link
//           </h2>

//           <div className="flex gap-3">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 readOnly
//                 value={fullLink}
//                 className="
//                   w-full border border-gray-300 rounded-lg
//                   px-4 py-3 pr-12 text-gray-700
//                   focus:outline-none focus:ring-2 focus:ring-purple-500
//                   transition
//                 "
//               />
//               <Copy       onClick={copyToClipboard} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
//             </div>

//             {/* <Button
//               onClick={copyToClipboard}
//               className="
//                 bg-purple-600 text-white
//                 hover:bg-purple-700
//                 focus:ring-2 focus:ring-purple-500
//                 transition
//               "
//             >
//               Copy
//             </Button> */}
//           </div>

//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Invite friends and earn rewards 🎉
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { Copy } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { QRCodeCanvas } from "qrcode.react"; // Use named import instead of default
// import { Switch as UiSwitch } from "@/components/ui/switch";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export function ReferralLink() {
//   const [fullLink, setFullLink] = useState("");
//   const [partnerWebsite, setPartnerWebsite] = useState("");
//   const [referralName, setReferralName] = useState("");
//   const [isFreeSignup, setIsFreeSignup] = useState(false);
//   const [websiteTitle, setWebsiteTitle] = useState("My Partner Website");
//   const [websiteImage, setWebsiteImage] = useState("https://placehold.co/600x400");
//   const [mode, setMode] = useState("preview"); // 'preview' or 'edit'

//   useEffect(() => {
//     const code = localStorage.getItem("referralCode") || "";
//     const name = localStorage.getItem("referralName") || "";
//     setReferralName(name);
//     setFullLink(`https://refer.rxpt.us/${name}`);
//     setPartnerWebsite(`https://rxpt.us/${name}`); // Assuming dynamic; adjust if truly static
//   }, []);

//   const copyToClipboard = async (text) => {
//     if (!text) return;
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Copied to clipboard!");
//     } catch {
//       toast.error("Failed to copy. Try again.");
//     }
//   };

//   const generateScreenshot = () => {
//     const preview = document.getElementById("website-mock");
//     if (!preview) return;
//     html2canvas(preview).then((canvas) => {
//       const img = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = img;
//       a.download = "website-screenshot.png";
//       a.click();
//       toast.success("Screenshot downloaded!");
//     });
//   };

//   const downloadBusinessCard = () => {
//     const card = document.getElementById("business-card");
//     if (!card) return;
//     html2canvas(card).then((canvas) => {
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save("business-card.pdf");
//       toast.success("Business card PDF downloaded!");
//     });
//   };

//   return (
//     <>
//       <Toaster position="top-right" />

//       {/* Full-screen purple backdrop */}
//       <div className="flex-1 flex items-center justify-center p-4 overflow-hidden my-5">
//         {/* Wider card */}
//         <div className="bg-white rounded-2xl p-8 max-w-3xl w-full">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//             Share Your Partner Referral Link
//           </h2>

//           <div className="flex gap-3">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 readOnly
//                 value={fullLink}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//               />
//               <Copy
//                 onClick={() => copyToClipboard(fullLink)}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//               />
//             </div>
//           </div>

//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Invite friends and earn rewards 🎉
//           </p>

//           {/* Referral QR Code */}
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Referral URL QR Code
//             </h3>
//             <div className="flex justify-center">
//               <QRCodeCanvas value={fullLink} size={128} />
//             </div>
//           </div>

//           {/* Partner Website URL */}
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Partner Website URL
//             </h3>
//             <div className="flex gap-3">
//               <div className="relative flex-1">
//                 <input
//                   type="text"
//                   readOnly
//                   value={partnerWebsite}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                 />
//                 <Copy
//                   onClick={() => copyToClipboard(partnerWebsite)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Partner Website Preview with Options */}
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Partner Website Preview
//             </h3>
//             <div className="flex justify-center gap-4 mb-4">
//               <Button onClick={() => setMode("preview")}>Preview</Button>
//               <Button onClick={() => setMode("edit")}>Edit Website</Button>
//               <div className="flex items-center gap-2">
//                 <UiSwitch checked={isFreeSignup} onCheckedChange={setIsFreeSignup} />
//                 <p>Activate FREE Signup</p>
//               </div>
//             </div>

//             {mode === "preview" && (
//               <>
//                 <div id="website-mock" className="border border-gray-300 p-4 rounded-lg bg-gray-100">
//                   <h1 className="text-2xl font-bold mb-2">{websiteTitle}</h1>
//                   <img
//                     src={websiteImage}
//                     alt="Website Image"
//                     className="w-full h-auto mb-4"
//                   />
//                   {!isFreeSignup ? (
//                     <>
//                       <div className="mb-2">Pricing: $10/month, etc.</div>
//                       <div>Package Options: Basic, Pro, Agent</div>
//                     </>
//                   ) : (
//                     <div>Free Signup Only - No pricing or package options</div>
//                   )}
//                 </div>
//                 <div className="flex justify-center mt-4">
//                   <Button onClick={generateScreenshot}>Preview (Screenshot)</Button>
//                 </div>
//               </>
//             )}

//             {mode === "edit" && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     value={websiteTitle}
//                     onChange={(e) => setWebsiteTitle(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Image URL</label>
//                   <input
//                     type="text"
//                     value={websiteImage}
//                     onChange={(e) => setWebsiteImage(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Partner Business Card Preview & Download */}
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Partner Business Card Preview
//             </h3>
//             <div
//               id="business-card"
//               className="border border-gray-300 p-4 rounded-lg mx-auto max-w-xs bg-white"
//             >
//               <h2 className="text-lg font-bold text-center">{referralName}</h2>
//               <p className="text-center text-sm">{fullLink}</p>
//               <div className="mt-2 flex justify-center">
//                 <QRCodeCanvas value={fullLink} size={100} />
//               </div>
//             </div>
//             <div className="flex justify-center mt-4">
//               <Button onClick={downloadBusinessCard}>Download PDF Vector File</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { Copy, DivideIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Switch as UiSwitch } from "@/components/ui/switch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
// -----------------------------
interface PartnerDetails {
  name: string;
  email: string;
  phone: string;
  referalName: string;
}
export function ReferralLink() {
  const [fullLink, setFullLink] = useState("");
  const [partnerWebsite, setPartnerWebsite] = useState("");
  const [referralName, setReferralName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isFreeSignup, setIsFreeSignup] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState("My Partner Website");
  const [websiteImage, setWebsiteImage] = useState("https://placehold.co/600x400");
  const [phone, setPhone] = useState("https://placehold.co/600x400");
  const [mode, setMode] = useState("preview"); // 'preview' or 'edit'
  const [activeTab, setActiveTab] = useState("referralLink"); // Active tab state
  const [showPreview, setShowPreview] = useState(false); // State to toggle iframe preview
  const referalName=localStorage.getItem("referralName");
    console.log(referalName)
  useEffect(() => {
    const fetchPartnerDetails = async (slug: string) => {
          console.log(referalName)

        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/getPartnerDetailbyReferalName/${slug}`
          );
          console.log(res)
            if (res.status === 200) {
              console.log("✅ Partner details fetched:", res.data);
              // setPARTNER_EMAIL(res.data.email);
              setPhone(res.data.phone);
          setReferralName("Test");
          const code = res.data.referalCode||localStorage.getItem("referralCode") || "";
          const name = res.data.referalName||localStorage.getItem("referralName") || "";
          const phone = res.data.phone|| "NA";
          setReferralName(name);
          setFullLink(`https://refer.rxpt.us/${name}`);
          // setPartnerWebsite(`http://localhost:4001/Ajaypartners`);
          setPartnerWebsite(`${window.location.origin}/${name}`);
          setReferralCode(code);
          setPhone(phone)
            }
          }catch(err){
            console.log('an error occured while fetching partner details',err)
          }
        }
        if(referalName){
             fetchPartnerDetails(referalName)
        }
 
  }, [referalName]);

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy. Try again.");
    }
  };

  const generateScreenshot = () => {
    const preview = document.getElementById("website-mock");
    if (!preview) return;
    html2canvas(preview).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = img;
      a.download = "website-screenshot.png";
      a.click();
      toast.success("Screenshot downloaded!");
    });
  };

  const downloadBusinessCard = () => {
    const card = document.getElementById("business-card");
    if (!card) return;

    html2canvas(card, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = imgWidth * 0.264583;
      const pdfHeight = imgHeight * 0.264583;
      const pdf = new jsPDF("l", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("business-card.pdf");
      toast.success("Business card PDF downloaded!");
    });
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 overflow-hidden my-5">
        <div className="bg-white rounded-2xl p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Partner Data
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setActiveTab("referralLink")}
              variant={activeTab === "referralLink" ? "default" : "outline"}
            >
              Referral Link
            </Button>
            <Button
              onClick={() => setActiveTab("websiteUrl")}
              variant={activeTab === "websiteUrl" ? "default" : "outline"}
            >
              Website URL
            </Button>
            <Button
              onClick={() => setActiveTab("businessCard")}
              variant={activeTab === "businessCard" ? "default" : "outline"}
            >
              Business Card
            </Button>
          </div>

          {/* Conditional Content Based on Active Tab */}
         {activeTab === "referralLink" && (
            <div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={fullLink}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <Copy
                    onClick={() => copyToClipboard(fullLink)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500 text-center">
                Invite friends and earn rewards 🎉
              </p>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Referral URL QR Code
                </h3>
                <div className="flex justify-center">
                  <QRCodeCanvas value={fullLink} size={128} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "websiteUrl" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Partner Website URL
              </h3>
              <div className="flex gap-3" style={{justifyContent: "center",
    alignItems: "center"}}>
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={partnerWebsite}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <Copy
                    onClick={() => copyToClipboard(partnerWebsite)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
             

              
                <Button onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Close Preview" : "Preview Website"}
                </Button>
                {/* <div className="flex items-center gap-2">
                  <UiSwitch checked={isFreeSignup} onCheckedChange={setIsFreeSignup} />
                  <p>Activate FREE Signup</p>
                </div>  */}
              </div>

              {showPreview && (
                <div className="mt-4">
                  <div id="website-mock" className="border border-gray-300 p-4 rounded-lg bg-gray-100">
                    <iframe
                     src={`${window.location.origin}/${referralName}`}
                      title="Website Preview"
                      className="w-full h-auto mb-4 border-none"
                      style={{ minHeight: "400px" }}
                      scrolling="yes"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "businessCard" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Partner Business Card Preview
              </h3>
              <div
                id="business-card"
                className="relative border border-gray-300 p-4 rounded-lg mx-auto max-w-md bg-white shadow-md"
                style={{
                  background: "linear-gradient(120deg, #ffffff 40%, #ede7f6 70%, #6524EB 100%)",
                }}
              >
                <div className="flex items-center mb-2">
                  <img
                    src="/rexpt-main.png"
                    alt="Icon"
                    className="w-12 h-12 mr-4 "
                  />
                  <div>
                    <h2 className="text-xl font-bold">{referralName}</h2>
                    <p className="text-sm text-gray-600">Partner</p>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm">
                    <strong>Referral Code:</strong> {referralCode}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> +{phone}
                  </p>
                  <p className="text-sm">
                    <strong>Website:</strong> {partnerWebsite}
                  </p>
                  <p className="text-sm">
                    <strong>Referral Link:</strong> {fullLink}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <QRCodeCanvas value={partnerWebsite} size={80} />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={downloadBusinessCard}>Download PDF Vector File</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
