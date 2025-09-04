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
import { Copy, X, Pencil } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Switch as UiSwitch } from "@/components/ui/switch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

/* ----------------------------- */
interface PartnerDetails {
  name: string;
  email: string;
  phone: string;
  referalName: string;
}

type EditTab = "personal" | "testimonials" | "about";

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  roleTitle?: string | null;
  imagePath?: string | null;
  createdAt?: string;
};

const toApiFileUrl = (p?: string) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p; // absolute already
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const cleaned = p.replace(/^(\.\.\/)+public/, "").replace(/^\/+/, "");
  return `${base}/${cleaned}`;
};

/* ----------------------------- */
export function ReferralLink() {
  const [fullLink, setFullLink] = useState("");
  const [partnerWebsite, setPartnerWebsite] = useState("");
  const [referralName, setReferralName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isFreeSignup, setIsFreeSignup] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState("My Partner Website");
  const [websiteImage, setWebsiteImage] = useState("https://placehold.co/600x400");
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [activeTab, setActiveTab] = useState<"referralLink" | "websiteUrl" | "businessCard">("referralLink");
  const [showPreview, setShowPreview] = useState(false);

  // EDIT MODAL state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>("personal");
  const [saving, setSaving] = useState(false);

  // Personal form (prefilled)
  const [personalForm, setPersonalForm] = useState({ name: "", email: "", phone: "" });

  // ======== Testimonials state ========
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tLoading, setTLoading] = useState(false);
  const [tSaving, setTSaving] = useState(false);
  const [showTModal, setShowTModal] = useState(false);
  const [isEditingT, setIsEditingT] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [tForm, setTForm] = useState<{
    quote: string;
    author: string;
    roleTitle: string;
    imageFile: File | null;
    imagePreview: string;
  }>({
    quote: "",
    author: "",
    roleTitle: "",
    imageFile: null,
    imagePreview: "",
  });

  // ======== About state (existing) ========
  const [aboutText, setAboutText] = useState("");
  const referalNameLS =
    typeof window !== "undefined" ? localStorage.getItem("referralName") : "";
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutImagePath, setAboutImagePath] = useState<string>("");
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string>("");

  // Track initial values to know if user changed anything
  const [aboutInitial, setAboutInitial] = useState<{ description: string; imagePath: string }>({
    description: "",
    imagePath: "",
  });

  /* =========================
     Fetch ABOUT when modal opens
     ========================= */
  useEffect(() => {
    if (!showEditModal || !referralName) return;

    (async () => {
      try {
        setAboutLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/aboutsection/${referralName}`
        );
        const desc = res.data?.aboutDescription || "";
        const imgPath = res.data?.aboutImage || "";
        const imgUrl = toApiFileUrl(imgPath);
        setAboutText(desc);
        setAboutImagePath(imgUrl);
        setAboutInitial({ description: desc, imagePath: imgPath });
        setAboutImageFile(null);
        setAboutPreview("");
      } catch (e) {
        console.error(e);
      } finally {
        setAboutLoading(false);
      }
    })();
  }, [showEditModal, referralName]);

  /* =========================
     Fetch TESTIMONIALS when modal opens or referral changes
     ========================= */
  useEffect(() => {
    if (!showEditModal || !referralName) return;
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditModal, referralName]);

  const fetchTestimonials = async () => {
    try {
      setTLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`
      );
      const list: Testimonial[] = (res.data?.testimonials || []).map((t: Testimonial) => ({
        ...t,
        imagePath: t.imagePath ? toApiFileUrl(t.imagePath) : null,
      }));
      setTestimonials(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials.");
    } finally {
      setTLoading(false);
    }
  };

  // ======== About handlers (existing) ========
  const onAboutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setAboutImageFile(file);
    if (aboutPreview) URL.revokeObjectURL(aboutPreview);
    setAboutPreview(URL.createObjectURL(file));
  };
  const clearSelectedAboutFile = () => {
    if (aboutPreview) URL.revokeObjectURL(aboutPreview);
    setAboutImageFile(null);
    setAboutPreview("");
  };

  const saveAbout = async () => {
    if (!referralName) return;
    if (!aboutDirty) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        "";
      const fd = new FormData();
      if ((aboutText ?? "") !== (aboutInitial.description ?? "")) {
        fd.append("aboutDescription", aboutText);
      }
      if (aboutImageFile) {
        fd.append("aboutImage", aboutImageFile);
      }

      const resp = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/addaboutsectionpartnerdashboard/${referralName}`,
        fd,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newDesc = resp.data?.aboutDescription ?? aboutText;
      const newPath = resp.data?.aboutImage ?? aboutImagePath;
      const newUrl = toApiFileUrl(newPath);

      setAboutText(newDesc);
      setAboutImagePath(newUrl);
      setAboutInitial({ description: newDesc, imagePath: newPath });
      clearSelectedAboutFile();

      toast.success("About section updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update About.");
    } finally {
      setSaving(false);
    }
  };

  // Dirty check
  const aboutDirty =
    (aboutText ?? "") !== (aboutInitial.description ?? "") || !!aboutImageFile;

  /* =========================
     Partner details (existing)
     ========================= */
  useEffect(() => {
    const fetchPartnerDetails = async (slug: string) => {
      try {
        const res = await axios.get<PartnerDetails>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/getPartnerDetailbyReferalName/${slug}`
        );

        if (res.status === 200) {
          const name = res.data.referalName || localStorage.getItem("referralName") || "";
          const code = localStorage.getItem("referralCode") || "";
          setReferralName(name);
          setPartnerName(res.data.name || "");
          setPartnerEmail(res.data.email || "");
          setPhone(res.data.phone || "");
          setReferralCode(code);
          setFullLink(`https://refer.rxpt.us/${name}`);
          setPartnerWebsite(`${window.location.origin}/${name}`);
        }
      } catch (err) {
        console.log("Error while fetching partner details", err);
        toast.error("Failed to load partner details.");
      }
    };

    if (referalNameLS) fetchPartnerDetails(referalNameLS);
  }, [referalNameLS]);

  // Prefill modal forms on open (existing personal form)
  useEffect(() => {
    if (!showEditModal) return;
    setPersonalForm({
      name: partnerName || "",
      email: partnerEmail || "",
      phone: phone || "",
    });
  }, [showEditModal]);

  const copyToClipboard = async (text: string) => {
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

  // Open modal instead of new tab
  const handleEditClick = () => {
    if (!partnerWebsite) {
      toast.error("Website URL not available yet.");
      return;
    }
    setEditTab("personal");
    setShowEditModal(true);
  };

  // Personal form helpers
  const personalDirty =
    personalForm.name !== partnerName ||
    personalForm.email !== partnerEmail ||
    personalForm.phone !== phone;

  const updatePersonalField = (field: "name" | "email" | "phone", value: string) => {
    setPersonalForm((f) => ({ ...f, [field]: value }));
  };

  const submitPersonalUpdate = async () => {
    if (!personalDirty) return;
    try {
      setSaving(true);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        "";

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updatePartnerDetailbyReferalName/${referralName}`;

      const resp = await axios.patch(
        url,
        {
          name: personalForm.name,
          email: personalForm.email,
          phone: personalForm.phone,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      setPartnerName(resp.data?.name || personalForm.name);
      setPartnerEmail(resp.data?.email || personalForm.email);
      setPhone(resp.data?.phone || personalForm.phone);

      toast.success("Personal details updated.");
      setShowEditModal(false);
    } catch (e) {
      console.error(e);
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     TESTIMONIALS handlers
     ========================= */
  const resetTForm = () => {
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm({
      quote: "",
      author: "",
      roleTitle: "",
      imageFile: null,
      imagePreview: "",
    });
    setEditingItem(null);
    setIsEditingT(false);
  };

  const openCreate = () => {
    resetTForm();
    setIsEditingT(false);
    setShowTModal(true);
  };

  const openEdit = (item: Testimonial) => {
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm({
      quote: item.quote || "",
      author: item.author || "",
      roleTitle: item.roleTitle || "",
      imageFile: null,
      imagePreview: item.imagePath ? String(item.imagePath) : "",
    });
    setEditingItem(item);
    setIsEditingT(true);
    setShowTModal(true);
  };

  const onTFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const submitTestimonial = async () => {
    if (!referralName) return;
    if (!tForm.quote.trim() || !tForm.author.trim()) {
      return toast.error("Quote and Author are required.");
    }
    try {
      setTSaving(true);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        "";

      const fd = new FormData();
      fd.append("quote", tForm.quote.trim());
      fd.append("author", tForm.author.trim());
      if (tForm.roleTitle?.trim()) fd.append("roleTitle", tForm.roleTitle.trim());
      if (tForm.imageFile) fd.append("image", tForm.imageFile);

      if (isEditingT && editingItem) {
        // update
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${editingItem.id}`,
          fd,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Testimonial updated.");
      } else {
        // create
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`,
          fd,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Testimonial created.");
      }

      setShowTModal(false);
      resetTForm();
      fetchTestimonials();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Request failed";
      toast.error(msg);
    } finally {
      setTSaving(false);
    }
  };

  // Testimonials local helper display image
  const tImage = (p?: string | null) => (p ? p : "/images/defaultiprofile.svg");

  /* =========================
     RENDER
     ========================= */
  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 overflow-hidden my-5">
        <div className="bg-white rounded-2xl p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Partner Data
          </h2>

          {/* Tabs */}
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

          {/* Referral Link */}
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

          {/* Website URL */}
          {activeTab === "websiteUrl" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Partner Website URL
              </h3>

              <div
                className="flex gap-3"
                style={{ justifyContent: "center", alignItems: "center" }}
              >
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

                <Button onClick={() => setShowPreview((s) => !s)}>
                  {showPreview ? "Close" : "Preview"}
                </Button>
                {/* EDIT now opens modal */}
                <Button variant="outline" onClick={handleEditClick} disabled={!partnerWebsite}>
                  Edit
                </Button>
              </div>

              {showPreview && partnerWebsite && (
                <div className="mt-4">
                  <div
                    id="website-mock"
                    className="border border-gray-300 p-4 rounded-lg bg-gray-100"
                  >
                    <iframe
                      src={partnerWebsite}
                      title="Website Preview"
                      className="w-full h-auto mb-4 border-none"
                      style={{ minHeight: "400px" }}
                      scrolling="yes"
                    />
                  </div>
                </div>
              )}

              {showPreview && !partnerWebsite && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Website URL not available yet. Please try again in a moment.
                </p>
              )}
            </div>
          )}

          {/* Business Card */}
          {activeTab === "businessCard" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Partner Business Card Preview
              </h3>
              <div
                id="business-card"
                className="relative border border-gray-300 p-4 rounded-lg mx-auto max-w-md bg-white shadow-md"
                style={{
                  background:
                    "linear-gradient(120deg, #ffffff 40%, #ede7f6 70%, #6524EB 100%)",
                }}
              >
                <div className="flex items-center mb-2">
                  <img src="/rexpt-main.png" alt="Icon" className="w-12 h-12 mr-4 " />
                  <div>
                    <h2 className="text-xl font-bold">{referralName}</h2>
                    <p className="text-sm text-gray-600">Partner</p>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm">
                    <strong>Name:</strong> {partnerName}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {partnerEmail}
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
                  <QRCodeCanvas value={partnerWebsite || fullLink} size={80} />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={downloadBusinessCard}>Download PDF Vector File</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 " onClick={() => setShowEditModal(false)} />
          {/* Modal */}
          <div
            className="relative mx-auto my-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-[#1b1b1f] shadow-2xl ring-1 ring-[#6424ec]/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#6424ec] px-6 py-4 text-white">
              <h3 id="edit-modal-title" className="text-lg font-semibold">
                Edit
              </h3>
              <button
                className="rounded-md p-2 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Segmented tabs */}
            <div className="px-6 pt-5">
              <div className="inline-flex overflow-hidden rounded-xl border border-[#6424ec]/20">
                <button
                  className={`px-4 py-2 text-sm font-medium transition ${editTab === "personal"
                      ? "bg-[#6424ec] text-white"
                      : "bg-white text-[#6424ec] hover:bg-[#6424ec]/5"
                    }`}
                  onClick={() => setEditTab("personal")}
                >
                  1) Edit Personal Details
                </button>
                <button
                  className={`border-l border-[#6424ec]/20 px-4 py-2 text-sm font-medium transition ${editTab === "testimonials"
                      ? "bg-[#6424ec] text-white"
                      : "bg-white text-[#6424ec] hover:bg-[#6424ec]/5"
                    }`}
                  onClick={() => setEditTab("testimonials")}
                >
                  2) Edit Testimonials
                </button>
                <button
                  className={`border-l border-[#6424ec]/20 px-4 py-2 text-sm font-medium transition ${editTab === "about"
                      ? "bg-[#6424ec] text-white"
                      : "bg-white text-[#6424ec] hover:bg-[#6424ec]/5"
                    }`}
                  onClick={() => setEditTab("about")}
                >
                  3) Edit About
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-4">
              {/* PERSONAL */}
              {editTab === "personal" && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                        Name
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                        value={personalForm.name}
                        onChange={(e) => updatePersonalField("name", e.target.value)}
                        placeholder="Partner name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                        value={personalForm.email}
                        onChange={(e) => updatePersonalField("email", e.target.value)}
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                        Phone
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                        value={personalForm.phone}
                        onChange={(e) => updatePersonalField("phone", e.target.value)}
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => setShowEditModal(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={submitPersonalUpdate}
                      disabled={!personalDirty || saving}
                    >
                      {saving ? "Updating..." : "Update"}
                    </button>
                  </div>
                </>
              )}

              {/* TESTIMONIALS (Create, List, Edit) */}
              {editTab === "testimonials" && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      {tLoading ? "Loading testimonials…" : `${testimonials.length}/5 used`}
                    </div>
                    <Button
                      onClick={openCreate}
                      disabled={testimonials.length >= 5}
                      title={testimonials.length >= 5 ? "Limit reached (5)" : "Create Testimonial"}
                    >
                      Create Testimonial
                    </Button>
                  </div>

                  {/* List */}
                  <div className="max-h-80 md:max-h-96 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tLoading && (
                        <>
                          <div className="h-40 rounded-lg border border-[#6424ec]/20 animate-pulse bg-gray-100" />
                          <div className="h-40 rounded-lg border border-[#6424ec]/20 animate-pulse bg-gray-100" />
                        </>
                      )}
                      {!tLoading && testimonials.length === 0 && (
                        <div className="text-sm text-gray-500">No testimonials yet. Click “Create Testimonial”.</div>
                      )}
                      {!tLoading &&
                        testimonials.map((t) => (
                          <div
                            key={t.id}
                            className="p-3 rounded-lg border border-[#6424ec]/20 bg-white shadow-sm flex gap-3"
                          >
                            <img
                              src={tImage(t.imagePath || undefined)}
                              alt={t.author}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-sm italic">“{t.quote}”</div>
                              <div className="mt-1 text-xs text-gray-700">
                                <span className="font-semibold">{t.author}</span>
                                {t.roleTitle ? ` • ${t.roleTitle}` : ""}
                              </div>
                            </div>
                            <button
                              className="self-start p-2 rounded hover:bg-gray-100"
                              title="Edit"
                              onClick={() => openEdit(t)}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* Create/Edit Modal */}
                  {showTModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                      <div className="absolute inset-0 bg-black/20" onClick={() => setShowTModal(false)} />
                      <div
                        className="relative mx-auto my-10 w-full max-w-lg rounded-2xl bg-white text-[#1b1b1f] shadow-2xl ring-1 ring-[#6424ec]/10 p-5 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold">
                            {isEditingT ? "Edit Testimonial" : "Create Testimonial"}
                          </h4>
                          <button className="p-2 rounded hover:bg-gray-100" onClick={() => setShowTModal(false)}>
                            <X size={18} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                              Quote *
                            </label>
                            <textarea
                              className="min-h-[90px] w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                              value={tForm.quote}
                              onChange={(e) => setTForm((f) => ({ ...f, quote: e.target.value }))}
                              placeholder="What do customers say?"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                                Author *
                              </label>
                              <input
                                className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                                value={tForm.author}
                                onChange={(e) => setTForm((f) => ({ ...f, author: e.target.value }))}
                                placeholder="Jane Doe"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                                Role / Title
                              </label>
                              <input
                                className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                                value={tForm.roleTitle}
                                onChange={(e) => setTForm((f) => ({ ...f, roleTitle: e.target.value }))}
                                placeholder="CEO, Acme Inc."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                              Image (optional)
                            </label>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                              onChange={onTFileChange}
                              className="block w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] file:mr-3 file:rounded-md file:border-0 file:bg-[#6424ec] file:px-3 file:py-2 file:text-white hover:file:opacity-90"
                            />
                            {tForm.imagePreview && (
                              <div className="mt-2">
                                <img
                                  src={tForm.imagePreview}
                                  alt="preview"
                                  className="h-24 w-24 rounded object-cover border"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                          <button
                            className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5"
                            onClick={() => {
                              setShowTModal(false);
                              resetTForm();
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
                            onClick={submitTestimonial}
                            disabled={tSaving}
                          >
                            {tSaving ? "Saving..." : isEditingT ? "Update" : "Create"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ABOUT (existing) */}
              {editTab === "about" && (
                <>
                  {aboutLoading ? (
                    <div className="text-sm text-gray-500">Loading about…</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                            About Description
                          </label>
                          <textarea
                            className="min-h-[140px] w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
                            value={aboutText}
                            onChange={(e) => setAboutText(e.target.value)}
                            placeholder="Tell visitors about you/your business…"
                          />
                        </div>

                        {/* Image picker */}
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
                            About Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                            onChange={onAboutFileChange}
                            className="block w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] file:mr-3 file:rounded-md file:border-0 file:bg-[#6424ec] file:px-3 file:py-2 file:text-white hover:file:opacity-90"
                          />
                          {aboutImageFile && (
                            <button
                              onClick={clearSelectedAboutFile}
                              className="mt-2 text-xs text-[#6424ec] underline"
                              type="button"
                            >
                              Remove selected file
                            </button>
                          )}
                        </div>

                        {/* Previews */}
                        <div className="flex items-start gap-4">
                          {aboutPreview && (
                            <div className="rounded-lg border border-[#6424ec]/20 p-2">
                              <img
                                src={aboutPreview}
                                alt="New About Preview"
                                className="h-28 w-28 rounded object-cover"
                              />
                              <div className="mt-1 text-center text-[11px] text-gray-500">
                                New image (unsaved)
                              </div>
                            </div>
                          )}

                          {aboutImagePath && (
                            <div className="rounded-lg border border-[#6424ec]/20 p-2">
                              <img
                                src={aboutImagePath}
                                alt="Current About"
                                className="h-28 w-28 rounded object-cover"
                              />
                              <div className="mt-1 text-center text-[11px] text-gray-500">
                                Current image {aboutPreview && "(will be replaced)"}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => setShowEditModal(false)}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={saveAbout}
                          disabled={!aboutDirty || saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}