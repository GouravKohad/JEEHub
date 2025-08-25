import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
  } | null;
}

export function PDFPreviewModal({ isOpen, onClose, file }: PDFPreviewModalProps) {
  const handleDownload = () => {
    if (file) {
      window.open(`/api/files/${file.id}/download`, '_blank');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isPDF = file?.mimeType === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl h-[80vh] flex flex-col animate-fade-in"
        data-testid="pdf-preview-modal"
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-red-600" />
              <div>
                <DialogTitle data-testid="file-name">
                  {file?.originalName || "File Preview"}
                </DialogTitle>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {file.mimeType}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={!file}
                title="Download"
                data-testid="button-download-file"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                data-testid="button-close-preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 p-4">
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            {file ? (
              isPDF ? (
                <div className="text-center">
                  <iframe
                    src={`/api/files/${file.id}/download`}
                    className="w-full h-full min-h-[500px] border-0 rounded-lg"
                    title={file.originalName}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">Preview not available for this file type</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click the download button to view the file
                  </p>
                  <Button
                    className="mt-4"
                    onClick={handleDownload}
                    data-testid="button-download-non-pdf"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                <p className="text-muted-foreground">No file selected</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
