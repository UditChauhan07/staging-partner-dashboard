"use client";

import React from "react";
import Modal from "@/components/ui/modal"; // Adjust the path if needed

type Modal3Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isEndingRef?: React.MutableRefObject<boolean>; // optional, used in parent
  isCallInProgress?: boolean; // optional, used in parent
};

const Modal3: React.FC<Modal3Props> = ({
  isOpen,
  onClose,
  children,
}) => {
    console.log("Rendering modal 3");
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Test Call" width="max-w-md">
      {children}
    </Modal>
  );
};

export default Modal3;
