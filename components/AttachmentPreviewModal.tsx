// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[];
// }

// export default function AttachmentPreviewModal({
//   isOpen,
//   onClose,
//   attachments,
// }: AttachmentPreviewModalProps) {
//     const parsedAttachments = (() => {
//   if (typeof attachments === "string") {
//     try {
//       return JSON.parse(attachments);
//     } catch (e) {
//       console.error("Failed to parse attachments:", e);
//       return [];
//     }
//   }
//   return attachments || [];
// })();
//     console.log(typeof attachments,parsedAttachments);
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Attachment Preview</DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {parsedAttachments?.length === 0 && (
//             <p className="text-sm text-gray-500">No attachments found.</p>
//           )}

//           {Array.isArray(parsedAttachments) && parsedAttachments.map((file, idx) => {
//             const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
//             const isImage = file.type?.startsWith("image/");
//             console.log(fileUrl,isImage)
//             return (
//               <div key={idx} className="border p-3 rounded shadow-sm">
//                 {isImage ? (
//                   <img
//                     src={fileUrl}
//                     alt={file.filename}
//                     className="w-full max-h-60 object-contain rounded"
//                   />
//                 ) : (
//                   <div className="text-sm text-gray-800">
//                     <p>{file.filename}</p>
//                     <a
//                       href={fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       Download File
//                     </a>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Attachment {
  filename: string;
  url: string;
  type: string;
}

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: Attachment[] | string;
}

export default function AttachmentPreviewModal({
  isOpen,
  onClose,
  attachments,
}: AttachmentPreviewModalProps) {
  // Parse attachments if they are a string
  const parsedAttachments = (() => {
    if (typeof attachments === "string") {
      try {
        return JSON.parse(attachments) as Attachment[];
      } catch (e) {
        console.error("Failed to parse attachments:", e);
        return [];
      }
    }
    return attachments || [];
  })();

//   console.log(typeof attachments, parsedAttachments);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Attachment Preview</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-6 p-4">
          {parsedAttachments?.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No attachments found.</p>
          )}

          {Array.isArray(parsedAttachments) &&
            parsedAttachments.map((file, idx) => {
              const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
              const isImage = file.type?.startsWith("image/");
              const isPDF = file.type?.includes("pdf");
              const isText = file.type?.startsWith("text/");

              console.log(fileUrl, { isImage, isPDF, isText });

              return (
                <div
                  key={idx}
                  className="w-full h-full flex flex-col items-center justify-center border p-2 rounded-lg shadow-sm"
                >
                  {isImage && (
                    <img
                      src={fileUrl}
                      alt={file.filename}
                      className="w-full h-full max-h-[80vh] object-contain rounded"
                    />
                  )}
                  {isPDF && (
                    <iframe
                      src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={file.filename}
                      className="w-full h-full max-h-[80vh] rounded"
                    />
                  )}
                  {isText && (
                    <div className="w-full h-full max-h-[80vh] overflow-auto p-4 bg-gray-100 rounded">
                      <iframe
                        src={fileUrl}
                        title={file.filename}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  {!isImage && !isPDF && !isText && (
                    <div className="text-sm text-gray-800 text-center">
                      <p>{file.filename}</p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-600 text-center">{file.filename}</p>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}