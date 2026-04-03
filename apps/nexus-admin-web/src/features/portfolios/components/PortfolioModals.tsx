"use client";

import React, { useState, useEffect } from "react";
import { User, Briefcase, GraduationCap, Globe, Github, Linkedin, ExternalLink, Edit2, CheckCircle, Info, Code, BookOpen, Settings } from "lucide-react";
import { Portfolio, PortfolioUpdate } from "../types";
import Image from "next/image";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ModalActionRow } from "@/components/admin/ModalActionRow";
import {
  AdminAvatarUploadField,
  AdminCheckboxField,
  AdminFormModal,
  AdminInputField,
  AdminListField,
  AdminTextAreaField,
} from "@/components/admin/form";

// ==========================================
// Portfolio Form Modal (Update Only)
// ==========================================
interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PortfolioUpdate, profileImage?: File | null) => void;
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

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      setPreviewUrl(initialData.profile_image || null);
    }
    setProfileImage(null);
  }, [initialData, isOpen]);

  const handleAvatarChange = (file: File | null, nextPreviewUrl: string | null) => {
    setProfileImage(file);
    setPreviewUrl(nextPreviewUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, profileImage);
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Portfolio"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Changes"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <AdminAvatarUploadField
            label="Profile Image"
            previewUrl={previewUrl}
            onImageChange={handleAvatarChange}
            helperText="Upload a profile photo. Best as a square aspect ratio."
          />
        </div>

        <AdminInputField
          label="First Name"
          type="text"
          value={formData.first_name || ""}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        />
        <AdminInputField
          label="Middle Name"
          type="text"
          value={formData.middle_name || ""}
          onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
        />
        <AdminInputField
          label="Last Name"
          type="text"
          value={formData.last_name || ""}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        />
        <AdminInputField
          label="Nickname"
          type="text"
          value={formData.nickname || ""}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        />
        <AdminInputField
          label="GDG ID"
          type="text"
          value={formData.gdg_id || ""}
          onChange={(e) => setFormData({ ...formData, gdg_id: e.target.value })}
        />
        <AdminInputField
          label="Membership Type"
          type="text"
          value={formData.membership_type || ""}
          onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
        />
        <AdminInputField
          label="Department"
          type="text"
          value={formData.department || ""}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          <AdminInputField
            label="Year Level"
            type="number"
            value={formData.year_level || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                year_level: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
          />
          <AdminInputField
            label="Program"
            type="text"
            value={formData.program || ""}
            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <AdminTextAreaField
            label="Bio"
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <AdminInputField
          label="GitHub URL"
          type="url"
          value={formData.github_url || ""}
          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
        />
        <AdminInputField
          label="LinkedIn URL"
          type="url"
          value={formData.linkedin_url || ""}
          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
        />
        <div className="sm:col-span-2">
          <AdminInputField
            label="Portfolio URL"
            type="url"
            value={formData.portfolio_website_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, portfolio_website_url: e.target.value })
            }
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Other Links"
            items={formData.other_links || []}
            onChange={(items) => setFormData({ ...formData, other_links: items })}
            placeholder="Add a URL and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Technical Skills"
            items={formData.technical_skills || []}
            onChange={(items) => setFormData({ ...formData, technical_skills: items })}
            placeholder="Add a skill and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Learning Interests"
            items={formData.learning_interests || []}
            onChange={(items) => setFormData({ ...formData, learning_interests: items })}
            placeholder="Add an interest and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Tools & Technologies"
            items={formData.tools_and_technologies || []}
            onChange={(items) => setFormData({ ...formData, tools_and_technologies: items })}
            placeholder="Add a tool and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminCheckboxField
            id="is_public"
            label="Make Portfolio Public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
          />
        </div>
      </div>
    </AdminFormModal>
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
        <ModalActionRow
          actions={[
            {
              key: "edit",
              label: "Edit Portfolio",
              icon: Edit2,
              onClick: () => onEdit(portfolio),
            },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center">
            {portfolio.profile_image ? (
              <Image src={portfolio.profile_image} alt={fullName} fill className="object-cover" />
            ) : (
              <User size={64} className="text-blue-300" />
            )}
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
