// File: components/ui/modal.tsx
import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  width?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, width = "max-w-lg" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 w-full ${width}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title || "Modal Title"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  )
}

export default Modal
