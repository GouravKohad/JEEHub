import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadDropzone } from "@/components/file-upload-dropzone";
import { PDFPreviewModal } from "@/components/pdf-preview-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Upload, 
  FileText, 
  Download,
  Trash2,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Files() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/files"],
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Success",
        description: "File deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    },
  });

  const handlePreviewFile = (file: any) => {
    setSelectedFile(file);
    setIsPDFPreviewOpen(true);
  };

  const handleDownloadFile = (file: any) => {
    window.open(`/api/files/${file.id}/download`, '_blank');
  };

  const handleDeleteFile = (fileId: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      deleteFileMutation.mutate(fileId);
    }
  };

  // Filter files based on search and filters
  const filteredFiles = files.filter((file: any) => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || file.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'text-red-600';
    if (mimeType.includes('word')) return 'text-blue-600';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'text-green-600';
    return 'text-gray-600';
  };

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case 'physics': return 'bg-physics text-white';
      case 'chemistry': return 'bg-chemistry text-white';
      case 'mathematics': return 'bg-mathematics text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Files</h2>
            <p className="text-muted-foreground">Manage your study materials and documents</p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="hover-lift"
            data-testid="button-upload-files"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Search, Filters, and View Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-files"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {/* Filters and View Controls */}
              <div className="flex gap-3 items-center">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-40" data-testid="filter-subject">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                    data-testid="view-grid"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                    data-testid="view-list"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Files ({filteredFiles.length})</span>
              <Filter className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {filteredFiles.map((file: any) => (
                  <div
                    key={file.id}
                    className={cn(
                      "border rounded-lg p-4 hover:bg-accent hover-lift cursor-pointer transition-colors group",
                      viewMode === "list" && "flex items-center space-x-4"
                    )}
                    data-testid={`file-${file.id}`}
                  >
                    <div className={cn(
                      "flex items-center space-x-3",
                      viewMode === "grid" ? "mb-3" : "flex-1"
                    )}>
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className={cn("h-5 w-5", getFileIcon(file.mimeType))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        {viewMode === "list" && (
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={cn(
                      "flex items-center justify-between",
                      viewMode === "list" ? "space-x-4" : "space-x-2"
                    )}>
                      {file.subject && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getSubjectColor(file.subject)
                        )}>
                          {file.subject.charAt(0).toUpperCase() + file.subject.slice(1)}
                        </span>
                      )}
                      
                      {viewMode === "grid" && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      )}

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewFile(file);
                          }}
                          data-testid={`preview-${file.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file);
                          }}
                          data-testid={`download-${file.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`menu-${file.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600"
                              data-testid={`delete-${file.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || subjectFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Upload your first file to get started"
                  }
                </p>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  data-testid="button-upload-first-file"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <FileUploadDropzone
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        file={selectedFile}
      />
    </div>
  );
}
