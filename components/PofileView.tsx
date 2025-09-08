"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2, Camera, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
import axios from "axios";

export function ProfileView({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [googleBusiness, setGoogleBusiness] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setpinCode] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("/images/defaultiprofile.svg");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
useEffect(() => {
  const interval = setInterval(() => {
    if (window.google?.maps?.places && autocompleteInputRef.current) {
      initAutocomplete();
      clearInterval(interval);
    }
  }, 300);

  return () => clearInterval(interval);
}, []);
  // Load Google Maps script manually
  // useEffect(() => {
  //   if (typeof window === "undefined" || (window as any).google) return;

  //   const script = document.createElement("script");
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
  //   script.async = true;
  //   script.defer = true;
  //   script.onload = initAutocomplete;
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

 const initAutocomplete = () => {
  if (!autocompleteInputRef.current || !window.google?.maps) return;

  const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const comps = place?.address_components || [];

    const get = (type: string) =>
      comps.find((c) => c.types.includes(type))?.long_name || "";

    setGoogleBusiness(place?.formatted_address || "");
    setCity(get("locality") || get("administrative_area_level_2"));
    setState(get("administrative_area_level_1"));
    setCountry(get("country"));
    setpinCode(get("postal_code"));
  });
};

  // Load Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/users/${userId}`);
        const data = res.data;

        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);

        if (data.profilePicture) {
          const rawPath = data.profilePicture;
          const cleanPath = rawPath.replace(/^(\.\.\/)+public/, "");
          const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
          setPreviewUrl(fullUrl);
        }

        const addr = data.address || {};
        setGoogleBusiness(data.address || "");
        setAddressLine(data.addressLine || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "");
        setpinCode(data.pinCode || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // Show local preview
  useEffect(() => {
    if (profileImage) {
      const objectUrl = URL.createObjectURL(profileImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const handleSubmit = async () => {
    try {
      setUpdating(true);

      const fullAddress = `${addressLine},${googleBusiness},${city}, ${state},${country} - ${pinCode}`;

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updatePartnerProfile/${userId}`, {
        name,
        email,
        phone,
        addressLine,
        address: fullAddress,
        city,
        state,
        country,
        pinCode,
      });

      if (profileImage) {
        const formData = new FormData();
        formData.append("profilePicture", profileImage);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/user/update_profile_picture/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      Swal.fire("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile", err);
      Swal.fire("Error", "Failed to update profile.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
        <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-1 p-1 bg-white rounded-lg ">
      <Card className="border-none shadow-none">
        <CardContent className="space-y-6 pt-4">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-3xl font-bold">Your Profile</h2>
            <Button  onClick={() => setShowPasswordModal(true)} className="bg-purple-600 text-white hover:bg-purple-700">
              Change Password
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group w-32 h-32 shrink-0 rounded-full border-blue-500 shadow-md overflow-hidden">
              <Image
                src={previewUrl}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
              />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="profile-image-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white w-6 h-6" />
              </label>
            </div>

            <div className="w-full">
              <Label htmlFor="name" className="block text-lg text-gray-700 mb-1">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Near by place</Label>
            <Input
              ref={autocompleteInputRef}
              placeholder="Search address or business"
              value={googleBusiness}
              onChange={(e) => setGoogleBusiness(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><Label>Address Line</Label><Input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} /></div>
            <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
            <div><Label>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} /></div>
            <div><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
            <div><Label>Pincode</Label><Input value={pinCode} onChange={(e) => setpinCode(e.target.value)} /></div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={updating} className="bg-purple-600 text-white hover:bg-purple-700">
              {updating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...</> : "Update Profile"}
            </Button>
          </div>
          {showPasswordModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <div className="space-y-4">
  {/* Old Password */}
  <div>
    <Label>Old Password</Label>
    <div className="relative">
      <Input
        type={showOld ? "text" : "password"}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowOld(!showOld)}
      >
        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>

  {/* New Password */}
  <div>
    <Label>New Password</Label>
    <div className="relative">
      <Input
        type={showNew ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowNew(!showNew)}
      >
        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>

  {/* Confirm New Password */}
  <div>
    <Label>Confirm New Password</Label>
    <div className="relative">
      <Input
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowConfirm(!showConfirm)}
      >
        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
</div>


      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            setShowPasswordModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          Cancel
        </Button>
       <Button
  disabled={changingPassword}
  className="bg-purple-600 text-white hover:bg-purple-700"
  onClick={async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Swal.fire("Please fill all fields.");
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire("New and confirm passwords do not match.");
    }

    try {
      setChangingPassword(true);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updateUserPassword/${userId}`,
        {
          oldPassword,
          newPassword,
        }
      );

      if (res.data=true) {
        Swal.fire({
  title: "Success!",
  text: "Password changed successfully.",
  icon: "success",
  confirmButtonText: "Great 👍",
  confirmButtonColor: "#7c3aed", // Tailwind purple-600
  background: "#f9f5ff", // light lavender background
  color: "#4c1d95", // deep purple text
  customClass: {
    popup: 'rounded-xl shadow-lg',
    confirmButton: 'px-6 py-2 text-lg font-semibold',
  },
});

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
      } 
    } catch (err: any) {
  console.error("Password update error:", err);

  const errorMessage =
    err?.response?.data?.error ||
    err?.response?.data?.message || 
    "Something went wrong";

  Swal.fire("Error", errorMessage, "error");
     } finally {
      setChangingPassword(false);
    }
  }}
>
  {changingPassword ? (
    <>
      <Loader2 className="animate-spin h-4 w-4 mr-2" />
      Changing...
    </>
  ) : (
    "Change Password"
  )}
</Button>

      </div>
    </div>
  </div>
)}

        </CardContent>
      </Card>
    </div>
  );
}
