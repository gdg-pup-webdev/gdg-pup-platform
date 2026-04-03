"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, User, Briefcase, GraduationCap, Globe, Github, Linkedin, ExternalLink, Edit2, CheckCircle, Info, Code, BookOpen, Settings, Camera, Upload } from "lucide-react";
import { GdgMember, GdgMemberUpdate } from "../types";
import Image from "next/image";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ModalActionRow } from "@/components/admin/ModalActionRow";

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

      setTagInputs({
        other_links: (initialData.otherLinks || []).join(", "),
        technical_skills: (initialData.technicalSkills || []).join(", "),
        learning_interests: (initialData.learningInterests || []).join(", "),
        tools_and_technologies: (initialData.toolsAndTechnologies || []).join(", "),
      });
    }
    setProfileImage(null);
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (field: keyof typeof tagInputs, value: string) => {
    setTagInputs((prev: typeof tagInputs) => ({ ...prev, [field]: value }));
    const arrayValue = value.split(",").map(v => v.trim()).filter(Boolean);
    setFormData((prev: GdgMemberUpdate) => ({ ...prev, [field]: arrayValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, profileImage);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Member">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Profile Image Upload */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Profile Image</label>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Profile Preview" fill className="object-cover" />
                ) : (
                  <Camera size={32} />
                )}
              </div>
              <div className="flex-1">
                <p className="mb-3 text-xs text-gray-500 leading-relaxed">
                  Upload a profile photo. Best as a square aspect ratio. Max size: 2MB.
                </p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Upload size={16} />
                  Choose Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.firstName || ""}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Middle Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.middleName || ""}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.lastName || ""}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Nickname</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.displayName || ""}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div> 
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Membership Type</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
              value={formData.membershipType || ""}
              onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
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
                value={formData.yearLevel || ""}
                onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value ? parseInt(e.target.value) : null })}
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
              value={formData.githubUrl || ""}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
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
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
            <label htmlFor="is_public" className="text-sm font-medium text-gray-700 select-none">Make Member Public</label>
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