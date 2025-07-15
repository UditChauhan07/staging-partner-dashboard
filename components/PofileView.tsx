"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2, Camera } from "lucide-react";
import axios from "axios";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";

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
  const [zip, setZip] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("/images/defaultiprofile.svg");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);


  const autocompleteRef = useRef<any>(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Load Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/users/${userId}`);
        const data = res.data;

        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);

        // Fix path and construct URL for profile image
        if (data.profilePicture) {
          const rawPath = data.profilePicture;
          const cleanPath = rawPath.replace(/^(\.\.\/)+public/, "");
          const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
          setPreviewUrl(fullUrl);
        } else {
          setPreviewUrl("/images/defaultiprofile.svg");
        }

        const addr = data.address || {};
        setGoogleBusiness(data.address || "");
        setAddressLine(addr.line || "");
        setCity(addr.city || "");
        setState(addr.state || "");
        setCountry(addr.country || "");
        setZip(addr.zip || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // Show local preview when a new file is selected
  useEffect(() => {
    if (profileImage) {
      const objectUrl = URL.createObjectURL(profileImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    const comps = place?.address_components || [];

    const get = (type: string) =>
      comps.find((c) => c.types.includes(type))?.long_name || "";

    setGoogleBusiness(place?.formatted_address || "");
    setCity(get("locality") || get("administrative_area_level_2"));
    setState(get("administrative_area_level_1"));
    setCountry(get("country"));
    setZip(get("postal_code"));
  };

  const handleSubmit = async () => {
    try {
      setUpdating(true);

      const fullAddress = `${addressLine},${googleBusiness},${city}, ${state},${country} - ${zip}`;

      // 1. Update profile data
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/users/${userId}`, {
        name,
        email,
        phone,
        password,
        address: fullAddress,
      });

      // 2. Upload profile image
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
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    console.log("reachedHere");
    return (
      <div
        style={{
          position: "fixed", // ✅ overlay entire screen
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)", // ✅ 50% white transparent
          zIndex: 9999, // ✅ ensure it's on top
        }}
      >
        <FadeLoader size={90} color="#6524EB" speedMultiplier={2} />
      </div>
    );
  }

  return (
    
    <div className="max-w-4xl mx-auto my-1 p-1 bg-white rounded-lg shadow-xl">

      <Card className="border-none shadow-none">
        <CardContent className="space-y-6 pt-4">
          <h2 className="text-3xl font-bold border-b pb-4 mb-4">Your Profile</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
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

            {/* Name Input */}
            <div className="w-full">
              <Label htmlFor="name" className="block text-lg text-gray-700 mb-1">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            <Label> Near by place</Label>
            <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
              <Input
                id="google-autocomplete"
                placeholder="Search address or business"
                value={googleBusiness}
                onChange={(e) => setGoogleBusiness(e.target.value)}
              />
            </Autocomplete>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label>Address Line</Label>
              <Input placeholder="House no.." value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div className="pt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
