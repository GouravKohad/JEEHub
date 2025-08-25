import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadDropzone({ isOpen, onClose }: FileUploadDropzoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [subject, setSubject] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, subject }: { file: File; subject: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !subject) {
      toast({
        title: "Validation Error",
        description: "Please select files and choose a subject.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const file of selectedFiles) {
        await uploadFileMutation.mutateAsync({ file, subject });
      }
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSubject("");
    onClose();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="file-upload-modal">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger data-testid="select-file-subject">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            )}
            data-testid="file-dropzone"
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-muted-foreground mb-1">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX, XLS, XLSX, TXT, Images (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    data-testid={`selected-file-${index}`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      data-testid={`remove-file-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            data-testid="button-cancel-upload"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !subject || uploadFileMutation.isPending}
            data-testid="button-upload-files"
          >
            {uploadFileMutation.isPending ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
