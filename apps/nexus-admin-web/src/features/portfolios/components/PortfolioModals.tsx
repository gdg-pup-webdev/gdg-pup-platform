"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, User, Briefcase, GraduationCap, Globe, Github, Linkedin, ExternalLink, Edit2, CheckCircle, Info, Code, BookOpen, Settings } from "lucide-react";
import { Portfolio, PortfolioUpdate } from "../types";

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
// Portfolio Form Modal (Update Only)
// ==========================================
interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PortfolioUpdate) => void;
  initialData: Portfolio | null;
  isSubmitting: boolean;
}

export function PortfolioFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: PortfolioFormModalProps) {
  const [formData, setFormData] = useState<PortfolioUpdate>({
    first_name: "",
    middle_name: "",
    last_name: "",
    nickname: "",
    gdg_id: "",
    membership_type: "",
    department: "",
    year_level: null,
    program: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    portfolio_website_url: "",
    is_public: true,
    other_links: [],
    technical_skills: [],
    learning_interests: [],
    tools_and_technologies: [],
  });

  // Helper to manage tag inputs as comma-separated strings
  const [tagInputs, setTagInputs] = useState({
    other_links: "",
    technical_skills: "",
    learning_interests: "",
    tools_and_technologies: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        middle_name: initialData.middle_name || "",
        last_name: initialData.last_name || "",
        nickname: initialData.nickname || "",
        gdg_id: initialData.gdg_id || "",
        membership_type: initialData.membership_type || "",
        department: initialData.department || "",
        year_level: initialData.year_level,
        program: initialData.program || "",
        bio: initialData.bio || "",
        github_url: initialData.github_url || "",
        linkedin_url: initialData.linkedin_url || "",
        portfolio_website_url: initialData.portfolio_website_url || "",
        is_public: initialData.is_public,
        other_links: initialData.other_links || [],
        technical_skills: initialData.technical_skills || [],
        learning_interests: initialData.learning_interests || [],
        tools_and_technologies: initialData.tools_and_technologies || [],
      });

      setTagInputs({
        other_links: (initialData.other_links || []).join(", "),
        technical_skills: (initialData.technical_skills || []).join(", "),
        learning_interests: (initialData.learning_interests || []).join(", "),
        tools_and_technologies: (initialData.tools_and_technologies || []).join(", "),
      });
    }
  }, [initialData, isOpen]);

  const handleTagChange = (field: keyof typeof tagInputs, value: string) => {
    setTagInputs(prev => ({ ...prev, [field]: value }));
    const arrayValue = value.split(",").map(v => v.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Portfolio">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.first_name || ""}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Middle Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.middle_name || ""}
              onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.last_name || ""}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Nickname</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.nickname || ""}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">GDG ID</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.gdg_id || ""}
              onChange={(e) => setFormData({ ...formData, gdg_id: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Membership Type</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.membership_type || ""}
              onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Department</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Year Level</label>
              <input
                type="number"
                className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                value={formData.year_level || ""}
                onChange={(e) => setFormData({ ...formData, year_level: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Program</label>
              <input
                type="text"
                className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                value={formData.program || ""}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Bio</label>
            <textarea
              rows={3}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">GitHub URL</label>
            <input
              type="url"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.github_url || ""}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">LinkedIn URL</label>
            <input
              type="url"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.linkedin_url || ""}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Portfolio URL</label>
            <input
              type="url"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.portfolio_website_url || ""}
              onChange={(e) => setFormData({ ...formData, portfolio_website_url: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Other Links (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. https://link1.com, https://link2.com"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={tagInputs.other_links}
              onChange={(e) => handleTagChange("other_links", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Technical Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, TypeScript"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={tagInputs.technical_skills}
              onChange={(e) => handleTagChange("technical_skills", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Learning Interests (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. AI, Rust, Web3"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={tagInputs.learning_interests}
              onChange={(e) => handleTagChange("learning_interests", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Tools & Technologies (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Docker, Git, VS Code"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={tagInputs.tools_and_technologies}
              onChange={(e) => handleTagChange("tools_and_technologies", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="is_public"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            />
            <label htmlFor="is_public" className="text-sm font-medium text-gray-700 select-none">Make Portfolio Public</label>
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
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-sm bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ==========================================
// Portfolio Details Modal
// ==========================================
interface PortfolioDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
  onEdit: (portfolio: Portfolio) => void;
}

export function PortfolioDetailsModal({ isOpen, onClose, portfolio, onEdit }: PortfolioDetailsModalProps) {
  if (!portfolio) return null;

  const fullName = [portfolio.first_name, portfolio.middle_name, portfolio.last_name]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Portfolio Details">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-b border-gray-50 pb-4">
          <button
            onClick={() => onEdit(portfolio)}
            className="flex items-center gap-1.5 rounded-sm bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={14} />
            Edit Portfolio
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-sm bg-blue-50 border border-blue-100">
             <User size={64} className="text-blue-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{fullName}</h3>
            <p className="text-sm text-gray-500 italic">"{portfolio.nickname || "No nickname"}"</p>
            <div className="mt-2 flex flex-wrap gap-2">
               <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {portfolio.membership_type || "Member"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {portfolio.gdg_id || "No GDG ID"}
              </span>
              {portfolio.is_public ? (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  <CheckCircle size={10} /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Info size={10} /> Private
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Briefcase size={12} /> Affiliation
            </h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold">Department:</span> {portfolio.department || "N/A"}</p>
              <p><span className="font-semibold">Education:</span> {portfolio.year_level ? `${portfolio.year_level} Year` : ""} {portfolio.program || ""}</p>
            </div>
          </div>

          <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <ExternalLink size={12} /> Socials
            </h4>
            <div className="flex flex-wrap gap-4 pt-1">
              {portfolio.github_url && (
                <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <Github size={20} />
                </a>
              )}
              {portfolio.linkedin_url && (
                <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <Linkedin size={20} />
                </a>
              )}
              {portfolio.portfolio_website_url && (
                <a href={portfolio.portfolio_website_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800">
                  <Globe size={20} />
                </a>
              )}
              {!portfolio.github_url && !portfolio.linkedin_url && !portfolio.portfolio_website_url && (
                <span className="text-xs italic text-gray-400">No links provided</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio</h4>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {portfolio.bio || "No biography provided."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Code size={12} /> Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                    {portfolio.technical_skills?.length > 0 ? (
                        portfolio.technical_skills.map((skill, i) => (
                            <span key={i} className="rounded-sm border border-blue-100 bg-blue-50/30 px-2 py-0.5 text-[10px] text-blue-700">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-gray-400 italic">None specified</span>
                    )}
                </div>
            </div>
            <div>
                <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <BookOpen size={12} /> Learning Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                    {portfolio.learning_interests?.length > 0 ? (
                        portfolio.learning_interests.map((interest, i) => (
                            <span key={i} className="rounded-sm border border-indigo-100 bg-indigo-50/30 px-2 py-0.5 text-[10px] text-indigo-700">
                                {interest}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-gray-400 italic">None specified</span>
                    )}
                </div>
            </div>
        </div>

        <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <Settings size={12} /> Tools & Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {portfolio.tools_and_technologies?.length > 0 ? (
                    portfolio.tools_and_technologies.map((tool, i) => (
                        <span key={i} className="rounded-sm border border-gray-100 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                            {tool}
                        </span>
                    ))
                ) : (
                    <span className="text-[10px] text-gray-400 italic">None specified</span>
                )}
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
