"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RaiseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null; 
  email: string | null;
  onSubmit: (comment: string, agentId: string, email: string) => void;
}

export function RaiseAgentRequest({
  isOpen,
  onClose,
  agentId,
  email,
  onSubmit,
}: RaiseRequestModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim() && agentId && email) {
      onSubmit(comment, agentId, email);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise a Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // 
  );
}
