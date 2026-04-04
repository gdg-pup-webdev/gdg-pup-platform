"use client";

import React, { useState, useEffect } from "react";
import { User, Briefcase, GraduationCap, Globe, Github, Linkedin, ExternalLink, Edit2, CheckCircle, Info, Code, BookOpen, Settings } from "lucide-react";
import { GdgMember, GdgMemberUpdate } from "../types";
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
// Member Form Modal (Update Only)
// ==========================================
interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GdgMemberUpdate, profileImage?: File | null) => void;
  initialData: GdgMember | null;
  isSubmitting: boolean;
}

export function MemberFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: MemberFormModalProps) {
  const [formData, setFormData] = useState<GdgMemberUpdate>({
    firstName: "",
    middleName: "",
    lastName: "",
    displayName: "", 
    membershipType: "",
    department: "",
    yearLevel: null,
    program: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "", 
    isPublic: true,
    otherLinks: [],
    technicalSkills: [],
    learningInterests: [],
    toolsAndTechnologies: [],
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        lastName: initialData.lastName || "",
        displayName: initialData.displayName || "", 
        membershipType: initialData.membershipType || "",
        department: initialData.department || "",
        yearLevel: initialData.yearLevel,
        program: initialData.program || "",
        bio: initialData.bio || "",
        githubUrl: initialData.githubUrl || "",
        linkedinUrl: initialData.linkedinUrl || "", 
        isPublic: initialData.isPublic,
        otherLinks: initialData.otherLinks || [],
        technicalSkills: initialData.technicalSkills || [],
        learningInterests: initialData.learningInterests || [],
        toolsAndTechnologies: initialData.toolsAndTechnologies || [],
      });

      // setPreviewUrl(initialData.profile_image || null);
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
      title="Update Member"
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
          value={formData.firstName || ""}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <AdminInputField
          label="Middle Name"
          type="text"
          value={formData.middleName || ""}
          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
        />
        <AdminInputField
          label="Last Name"
          type="text"
          value={formData.lastName || ""}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <AdminInputField
          label="Nickname"
          type="text"
          value={formData.displayName || ""}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
        <AdminInputField
          label="Membership Type"
          type="text"
          value={formData.membershipType || ""}
          onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
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
            value={formData.yearLevel || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                yearLevel: e.target.value ? parseInt(e.target.value, 10) : null,
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
          value={formData.githubUrl || ""}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
        />

        <AdminInputField
          label="LinkedIn URL"
          type="url"
          value={formData.linkedinUrl || ""}
          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
        />

        <div className="sm:col-span-2">
          <AdminListField
            label="Other Links"
            items={formData.otherLinks || []}
            onChange={(items) => setFormData({ ...formData, otherLinks: items })}
            placeholder="Add a URL and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Technical Skills"
            items={formData.technicalSkills || []}
            onChange={(items) => setFormData({ ...formData, technicalSkills: items })}
            placeholder="Add a skill and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Learning Interests"
            items={formData.learningInterests || []}
            onChange={(items) => setFormData({ ...formData, learningInterests: items })}
            placeholder="Add an interest and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminListField
            label="Tools & Technologies"
            items={formData.toolsAndTechnologies || []}
            onChange={(items) => setFormData({ ...formData, toolsAndTechnologies: items })}
            placeholder="Add a tool and press Enter..."
          />
        </div>

        <div className="sm:col-span-2">
          <AdminCheckboxField
            id="is_public"
            label="Make Member Public"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          />
        </div>
      </div>
    </AdminFormModal>
  );
}

// ==========================================
// Member Details Modal
// ==========================================
interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: GdgMember | null;
  onEdit: (member: GdgMember) => void;
}

export function MemberDetailsModal({ isOpen, onClose, member, onEdit }: MemberDetailsModalProps) {
  if (!member) return null;

  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Details">
      <div className="space-y-6">
        <ModalActionRow
          actions={[
            {
              key: "edit",
              label: "Edit Member",
              icon: Edit2,
              onClick: () => onEdit(member),
            },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{fullName}</h3>
            <p className="text-sm text-gray-500 italic">"{member.displayName || "No displayName"}"</p>
            <div className="mt-2 flex flex-wrap gap-2">
               <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {member.membershipType || "Member"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {member.gdgId || "No GDG ID"}
              </span>
              {member.isPublic ? (
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
              <p><span className="font-semibold">Department:</span> {member.department || "N/A"}</p>
              {/* FIXED: year_level -> yearLevel */}
              <p><span className="font-semibold">Education:</span> {member.yearLevel ? `${member.yearLevel} Year` : ""} {member.program || ""}</p>
            </div>
          </div>

          <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <ExternalLink size={12} /> Socials
            </h4>
            <div className="flex flex-wrap gap-4 pt-1">
              {/* FIXED: github_url -> githubUrl */}
              {member.githubUrl && (
                <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                  <Github size={20} />
                </a>
              )}
              {/* FIXED: linkedin_url -> linkedinUrl */}
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <Linkedin size={20} />
                </a>
              )}
              {/* FIXED: member_website_url -> portfolioWebsiteUrl */}
              {member.portfolioWebsiteUrl && (
                <a href={member.portfolioWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800">
                  <Globe size={20} />
                </a>
              )}
              {!member.githubUrl && !member.linkedinUrl && !member.portfolioWebsiteUrl && (
                <span className="text-xs italic text-gray-400">No links provided</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio</h4>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {member.bio || "No biography provided."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Code size={12} /> Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                    {/* FIXED: technical_skills -> technicalSkills */}
                    {member.technicalSkills && member.technicalSkills.length > 0 ? (
                        member.technicalSkills.map((skill: string, i: number) => (
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
                    {/* FIXED: learning_interests -> learningInterests */}
                    {member.learningInterests && member.learningInterests.length > 0 ? (
                        member.learningInterests.map((interest: string, i: number) => (
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
                {/* FIXED: tools_and_technologies -> toolsAndTechnologies */}
                {member.toolsAndTechnologies && member.toolsAndTechnologies.length > 0 ? (
                    member.toolsAndTechnologies.map((tool: string, i: number) => (
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