"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Calendar, User, Info, Edit2, Trash2, Image as ImageIcon, Type, FileText, Search, MapPin, Upload, CheckCircle2, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Article, ArticleInsert, ArticleUpdate, UserType } from "../types";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { useSearchUsers } from "@/features/users/hooks/useSearchUsers";
import { Pagination } from "@/components/admin/Pagination";
import { useUploadFile } from "@/features/file-system/hooks/useUploadFile";
import Image from "next/image";
import { contract } from "@packages/nexus-api-contracts";

// ==========================================
// Modal Wrapper
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl min-w-[320px] sm:min-w-[450px] overflow-hidden rounded-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Event Selection Modal
// ==========================================
interface EventSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (event: any) => void;
}

export function EventSearchModal({ isOpen, onClose, onSelect }: EventSearchModalProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: eventsResponse, isLoading } = useListEvents(page, pageSize);

  const events = eventsResponse?.data || [];
  const totalPages = eventsResponse?.meta?.totalPages || 1;
  const totalRecords = eventsResponse?.meta?.totalRecords || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Nexus Event">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-teal-600" />
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-2">
            <div className="divide-y divide-gray-100 rounded-sm border border-gray-100 bg-white shadow-sm">
              {events.map((event: any) => (
                <button
                  key={event.id}
                  onClick={() => {
                    onSelect(event);
                    onClose();
                  }}
                  className="flex w-full flex-col p-4 text-left hover:bg-teal-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-gray-900">{event.title}</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 uppercase">
                      {event.category}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-teal-600" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-teal-600" />
                      <span className="truncate max-w-[150px]">{event.venue || "TBA"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalRecords={totalRecords}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar size={32} className="mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No events found.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ==========================================
// User Selection Modal
// ==========================================
interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: UserType) => void;
}

export function UserSearchModal({ isOpen, onClose, onSelect }: UserSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: usersResponse, isLoading } = useSearchUsers(searchQuery);

  const users = usersResponse?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Author">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search by name or email..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus:border-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-teal-600" />
          </div>
        ) : users.length > 0 ? (
          <div className="divide-y divide-gray-100 rounded-sm border border-gray-100 bg-white shadow-sm max-h-[400px] overflow-y-auto">
            {users.map((user) => (
              <button
                key={user.gdgId}
                onClick={() => {
                  onSelect(user);
                  onClose();
                }}
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-teal-50 transition-colors"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">
                  {user.gdgId.slice(0, 8)}...
                </span>
              </button>
            ))}
          </div>
        ) : searchQuery.length >= 2 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <User size={32} className="mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No users found for "{searchQuery}".</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Search size={32} className="mb-3 opacity-20" />
            <p className="text-sm">Type at least 2 characters to search.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ==========================================
// Article Form Modal (Create / Update)
// ==========================================
interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, thumbnail?: File) => void;
  initialData?: Article | null;
  isSubmitting: boolean;
}

export function ArticleFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ArticleFormModalProps) {
  const [formData, setFormData] = useState<ArticleInsert>({
    title: "",
    description: "",
    content: "",
    image_url: null,
    author_id: null,
    event_id: null,
    is_published: false,
    published_at: new Date().toISOString(),
  });

  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const uploadFile = useUploadFile();

  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedAuthorName, setSelectedAuthorName] = useState("");

  const [isEventSearchOpen, setIsEventSearchOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (!file) continue;

        // Prevent default paste if it's an image
        e.preventDefault();

        const fileName = `pasted-image-${Date.now()}.png`;
        
        try {
          const res = await uploadFile.mutateAsync({
            file,
            data: {
              fileName,
              fileDescription: `Pasted image for article: ${formData.title || "Untitled"}`,
              folderId: null,
              path: "articles",
            }
          });

          if (res.status === 200) {
            const imageUrl = (res.body as any).data.previewUrl;
            const markdownImage = `![${fileName}](${imageUrl})`;
            
            // Insert at cursor position
            const textarea = contentRef.current;
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = formData.content;
              const before = text.substring(0, start);
              const after = text.substring(end);
              
              const newContent = `${before}${markdownImage}${after}`;
              setFormData({ ...formData, content: newContent });
              
              // We need to set the cursor position after the state update
              setTimeout(() => {
                if (textarea) {
                  textarea.focus();
                  textarea.setSelectionRange(
                    start + markdownImage.length,
                    start + markdownImage.length
                  );
                }
              }, 0);
            }
          }
        } catch (error) {
          console.error("Failed to upload pasted image:", error);
          alert("Failed to upload image. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        content: initialData.content,
        image_url: initialData.image_url || null,
        author_id: initialData.author_id,
        event_id: initialData.event_id,
        is_published: initialData.is_published,
        published_at: initialData.published_at || new Date().toISOString(),
      });
      setPreviewUrl(initialData.image_url || null);
      setSelectedEventTitle("Currently selected event"); 
      setSelectedAuthorName("Currently selected author");
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        image_url: null,
        author_id: null,
        event_id: null,
        is_published: false,
        published_at: new Date().toISOString(),
      });
      setPreviewUrl(null);
      setSelectedEventTitle("");
      setSelectedAuthorName("");
    }
    setThumbnail(undefined);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, thumbnail);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Article" : "Create Article"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Title</label>
              <input
                required
                type="text"
                className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Event</label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-sm border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 truncate">
                  {selectedEventTitle || (formData.event_id ? `ID: ${formData.event_id.slice(0,8)}...` : "None selected")}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEventSearchOpen(true)}
                  className="flex items-center justify-center rounded-sm bg-[#0B1F3B] px-3 text-white hover:bg-[#0B1F3B]/90"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Author</label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-sm border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 truncate">
                  {selectedAuthorName || (formData.author_id ? `ID: ${formData.author_id.slice(0,8)}...` : "None selected")}
                </div>
                <button
                  type="button"
                  onClick={() => setIsUserSearchOpen(true)}
                  className="flex items-center justify-center rounded-sm bg-[#0B1F3B] px-3 text-white hover:bg-[#0B1F3B]/90"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Publish Status</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                className={`flex w-full items-center justify-center gap-2 rounded-sm border py-2.5 px-4 text-xs font-bold transition-all ${
                  formData.is_published 
                    ? "border-teal-500 bg-teal-50 text-teal-700" 
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {formData.is_published ? (
                  <>
                    <Globe size={14} />
                    Published
                  </>
                ) : (
                  <>
                    <X size={14} />
                    Draft
                  </>
                )}
              </button>
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Publish Date</label>
              <input
                required
                type="datetime-local"
                className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, published_at: new Date(e.target.value).toISOString() })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
              <textarea
                required
                rows={2}
                className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2 relative">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                Content (Markdown)
                {uploadFile.isPending && (
                  <span className="ml-2 inline-flex items-center text-[10px] text-teal-600 normal-case font-medium">
                    <Loader2 size={10} className="mr-1 animate-spin" />
                    Uploading image...
                  </span>
                )}
              </label>
              <textarea
                ref={contentRef}
                required
                rows={8}
                className="w-full font-mono rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                value={formData.content}
                placeholder="# Use Markdown here..."
                onPaste={handlePaste}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <p className="mt-1 text-[10px] text-gray-400">
                Tip: You can paste images directly into the editor to upload them.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Thumbnail Image</label>
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-sm border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="mb-3 text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-semibold">
                    Upload a thumbnail image for this article. Recommended size: 800x450 (16:9).
                  </p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    <Upload size={14} />
                    Choose Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {formData.image_url && !thumbnail && (
                    <p className="mt-2 text-[10px] text-teal-600 font-bold uppercase tracking-widest">
                      Current image will be kept unless you choose a new one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadFile.isPending}
              className="flex items-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 disabled:opacity-50"
            >
              {(isSubmitting || uploadFile.isPending) && <Loader2 size={16} className="animate-spin" />}
              {initialData ? "Save Changes" : "Create Article"}
            </button>
          </div>
        </form>
      </Modal>

      <EventSearchModal
        isOpen={isEventSearchOpen}
        onClose={() => setIsEventSearchOpen(false)}
        onSelect={(event) => {
          setFormData({ ...formData, event_id: event.id });
          setSelectedEventTitle(event.title);
        }}
      />

      <UserSearchModal
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
        onSelect={(users) => { 
          console.log(users); 
          setFormData({ ...formData, author_id: users.gdgId });
          setSelectedAuthorName(users.displayName || users.firstName + " " + users.lastName);
        }}
      />
    </>
  );
}

// ==========================================
// Article Details Modal
// ==========================================
interface ArticleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

export function ArticleDetailsModal({ isOpen, onClose, article, onEdit, onDelete }: ArticleDetailsModalProps) {
  if (!article) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Article Details">
      <div className="space-y-6">
        <div className="flex justify-end gap-2 border-b border-gray-50 pb-4">
          <button
            onClick={() => onEdit(article)}
            className="flex items-center gap-1.5 rounded-sm bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(article)}
            className="flex items-center gap-1.5 rounded-sm bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        <div className="space-y-4">
          {article.image_url && (
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-48 sm:h-64 object-cover rounded-sm border border-gray-100" 
            />
          )}
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{article.title}</h3>
              {article.is_published ? (
                <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 uppercase border border-teal-100">
                  <Globe size={10} />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-400 uppercase border border-gray-100">
                  <X size={10} />
                  Draft
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 italic border-l-4 border-teal-500 pl-4">
              {article.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600" />
              Created: {new Date(article.created_at).toLocaleDateString()}
            </div>
            {article.published_at && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-teal-600" />
                Published: {new Date(article.published_at).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-teal-600" />
              Author ID: {article.author_id}
            </div>
          <div>Article ID: {article.id}</div>

          </div>
          <div className="prose prose-sm max-w-none rounded-sm border border-gray-100 bg-gray-50 p-6">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {article.content}
             </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-8 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// Delete Confirmation Modal
// ==========================================
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, isDeleting }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Article">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-sm bg-red-50 p-4">
          <div className="shrink-0 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900">Warning: Dangerous Action</p>
            <p className="mt-1 text-sm text-red-700 leading-relaxed">
              Are you sure you want to delete <span className="font-bold underline">"{itemName}"</span>? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-sm bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
