"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import Swal from "sweetalert2";
import axios from "axios";
import imageCompression from "browser-image-compression";
import ClipLoader from "react-spinners/ClipLoader";


const RaiseTicketModal = ({
  isOpen,
  onClose,
  pageContext,
  agentId,
  mode = "raise",
  ticket = null,
  onSuccess,
  priority = "Medium",
  department = "Support",
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
    priority,
    department,
    relatedFeatureId: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const userId=localStorage.getItem("userId");
  useEffect(() => {
    if (mode !== "raise" && ticket) {
      setFormData({
        subject: ticket.subject || "",
        category: ticket.category || "",
        description: ticket.description || "",
        priority: ticket.priority || priority,
        department: ticket.department || department,
        relatedFeatureId: ticket.relatedFeatureId || "",
      });
    } else {
      const categoryMap: Record<string, string> = {
        "Edit Agent": "Agent Editing",
        "Create Agent": "Agent Creation",
        "User Management": "User Management",
        Commission: "Commission Issue",
        "Call Forwarding": "Call Forwarding",
        "Phone Number Assignment": "Phone Number Assignment",
      };
      setFormData((prev) => ({
        ...prev,
        category: categoryMap[pageContext] || "General Inquiry",
      }));
    }
  }, [mode, ticket, pageContext]);

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  if (selected.size > 5 * 1024 * 1024) {
    setError("File must be under 5MB");
    return;
  }

  if (!["image/png", "image/jpeg", "application/pdf"].includes(selected.type)) {
    setError("Only PNG, JPG, or PDF files allowed");
    return;
  }

  if (selected.type.startsWith("image/")) {
    try {
      const compressedBlob = await imageCompression(selected, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const compressedFile = new File([compressedBlob], selected.name, {
        type: selected.type,
        lastModified: Date.now(),
      });

      setFile(compressedFile);
    } catch (err) {
      console.error("Compression failed", err);
      setError("Image compression failed");
    }
  } else {
    setFile(selected);
  }

  setError("");
};


  const handleSubmit = async () => {
    setError("");
    const { subject, category, description, priority, department } = formData;

    if (!subject || !category || !description || !priority || !department) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("subject", subject);
      payload.append("category", category);
      payload.append("description", description);
      payload.append("priority", priority);
      payload.append("department", department);
      payload.append("relatedFeatureId", formData.relatedFeatureId);
      payload.append("agentId", formData.relatedFeatureId || null);
      payload.append("userId",userId); // Replace with auth context
      payload.append("pageContext", pageContext);
      if (file) payload.append("ticketAttachments", file);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/create_ticket`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      console.log("Ticket created", res.data);
      Swal.fire("Success!", `Ticket ID: ${res?.data?.ticket?.ticketId}`, "success");
    
    setFormData({
    subject: "",
    category: "",
    description: "",
    priority,
    department,
    relatedFeatureId: "",
  }); 
  setFile(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Submit error", err);
      setError("Failed to submit ticket");
    }finally {setLoading(false);}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Raise Ticket" width="max-w-md">
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label htmlFor="subject">Subject</label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter ticket subject"
            maxLength={100}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category">Category</label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              <SelectItem value="Agent Creation">Agent Creation</SelectItem>
              <SelectItem value="Agent Editing">Agent Editing</SelectItem>
              <SelectItem value="User Management">User Management</SelectItem>
              <SelectItem value="Commission Issue">Commission Issue</SelectItem>
              <SelectItem value="Call Forwarding">Call Forwarding</SelectItem>
              <SelectItem value="Phone Number Assignment">Phone Number Assignment</SelectItem>
              <SelectItem value="Phone Number Assignment">Billing Issue</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Describe the issue"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(val) => setFormData({ ...formData, priority: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(val) => setFormData({ ...formData, department: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Related Feature ID */}
        <div>
          <Label htmlFor="relatedFeatureId">Agent ID (optional)</Label>
          <Input
            id="relatedFeatureId"
            value={formData.relatedFeatureId}
            onChange={(e) => setFormData({ ...formData, relatedFeatureId: e.target.value })}
            placeholder="e.g. AGNT-1023"
          />
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="file">Attachment (optional)</Label>
          <Input
            id="file"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFileChange}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <ClipLoader size={17} color="#ffffffff"/> : mode === "raise" ? "Submit" : mode === "resolve" ? "Resolve" : "Reopen"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose} disabled={loading}> 
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RaiseTicketModal;
