"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Users, Plus, Trash2, Search, UserPlus, Edit2, Check, User as UserIcon } from "lucide-react";
import { Team, TeamInsert, TeamUpdate, TeamMember } from "../types";
import { useAddTeamMember, useRemoveTeamMember, useUpdateTeamMember, useTeam, useSearchUsers } from "../api/teams";
import { toast } from "react-toastify";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ModalActionRow } from "@/components/admin/ModalActionRow";
import { AdminFormModal, AdminInputField, AdminTextAreaField } from "@/components/admin/form";

// ==========================================
// Team Form Modal (Create / Update)
// ==========================================
interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamInsert | TeamUpdate) => void;
  initialData?: Team;
  isSubmitting: boolean;
}

export function TeamFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TeamFormModalProps) {
  const [formData, setFormData] = useState<TeamInsert>({
    name: "",
    description: "",
    responsibilities: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        responsibilities: initialData.responsibilities || "",
        parent_team_id: initialData.parent_team_id || undefined,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        responsibilities: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Update Team" : "Create New Team"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? "Save Changes" : "Create Team"}
    >
      <AdminInputField
        label="Team Name"
        required
        type="text"
        placeholder="e.g. Web Development Team"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <AdminTextAreaField
        label="Description"
        required
        rows={3}
        placeholder="Briefly describe what this team does..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <AdminTextAreaField
        label="Responsibilities"
        rows={4}
        placeholder="List the key responsibilities (one per line)..."
        helperText="Tip: put one responsibility per line."
        value={formData.responsibilities || ""}
        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
      />
    </AdminFormModal>
  );
}

// ==========================================
// Team Details Modal (View & Manage Members)
// ==========================================
interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  openAddMemberOnOpen?: boolean;
}

export function TeamDetailsModal({
  isOpen,
  onClose,
  team: initialTeam,
  onEdit,
  onDelete,
  openAddMemberOnOpen = false,
}: TeamDetailsModalProps) {
  const { data: teamResponse, isLoading: isLoadingTeam } = useTeam(initialTeam?.id || "");
  const team = teamResponse?.body?.data || initialTeam;

  const [isAddingMember, setIsAddingMember] = useState(openAddMemberOnOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [position, setPosition] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersResponse, isLoading: isSearching } = useSearchUsers(debouncedSearch);
  const addMemberMutation = useAddTeamMember();
  const removeMemberMutation = useRemoveTeamMember();
  const updateMemberMutation = useUpdateTeamMember();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!initialTeam) return null;

  const activeTeam = team || initialTeam;

  const toggleAddMember = () => {
    setIsAddingMember((value) => {
      const nextValue = !value;
      if (!nextValue) {
        setSelectedUser(null);
        setPosition("");
        setSearchQuery("");
      }
      return nextValue;
    });
  };

  const searchResults = usersResponse?.body?.data?.filter((user: any) => 
    !team?.members?.some((m: TeamMember) => m.user_id === user.id)
  ) || [];

  const handleAddMember = async () => {
    if (!selectedUser || !position || !team) return;

    try {
      await addMemberMutation.mutateAsync({
        teamId: team.id,
        userId: selectedUser.id,
        position,
      });
      setIsAddingMember(false);
      setSelectedUser(null);
      setPosition("");
      setSearchQuery("");
      toast.success("Member added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!team || !window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeMemberMutation.mutateAsync({
        teamId: team.id,
        memberId,
      });
      toast.success("Member removed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    }
  };

  const handleUpdateMember = async (memberId: string) => {
    if (!team) return;
    try {
      await updateMemberMutation.mutateAsync({
        teamId: team.id,
        memberId,
        position: editingPosition,
      });
      setEditingMemberId(null);
      toast.success("Position updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update position");
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchQuery(`${user.display_name} (${user.email})`);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Details & Management">
      {isLoadingTeam && !team ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <ModalActionRow
            actions={[
              {
                key: "add-member",
                label: isAddingMember ? "Cancel Add Member" : "Add Member",
                icon: isAddingMember ? X : UserPlus,
                tone: isAddingMember ? "neutral" : "primary",
                onClick: toggleAddMember,
              },
              {
                key: "edit",
                label: "Edit Team",
                icon: Edit2,
                onClick: () => {
                  onClose();
                  onEdit(activeTeam);
                },
              },
              {
                key: "delete",
                label: "Delete Team",
                icon: Trash2,
                tone: "danger",
                onClick: () => {
                  onClose();
                  onDelete(activeTeam);
                },
              },
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded bg-teal-50 text-teal-600">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{team?.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">ID: {team?.id}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-sm border border-gray-100 bg-gray-50/50 p-4">
            <div>
              <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
              <p className="text-sm leading-relaxed text-gray-700">{team?.description}</p>
            </div>
            
            {team?.responsibilities && (
              <div>
                <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Responsibilities</h4>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{team.responsibilities}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Members ({team?.members?.length || 0})</h4>
              <button
                onClick={toggleAddMember}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                {isAddingMember ? <X size={14} /> : <Plus size={14} />}
                {isAddingMember ? "Cancel" : "Add Member"}
              </button>
            </div>

            {isAddingMember && (
              <div className="mb-6 space-y-4 rounded-sm border border-teal-100 bg-teal-50/30 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email..."
                      className={`w-full rounded-sm border py-2.5 pr-10 pl-10 text-sm outline-none transition-all ${
                        selectedUser ? "border-teal-500 bg-teal-50/50 font-bold text-teal-900" : "border-gray-200 bg-white"
                      }`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!selectedUser) setShowDropdown(true);
                      }}
                      onFocus={() => !selectedUser && setShowDropdown(true)}
                      readOnly={!!selectedUser}
                    />
                    {selectedUser ? (
                      <button 
                        onClick={clearSelection}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-teal-600 hover:text-teal-800"
                      >
                        <X size={16} />
                      </button>
                    ) : isSearching ? (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-gray-400" />
                      </div>
                    ) : null}
                  </div>
                  
                  {showDropdown && searchQuery.length >= 2 && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95">
                      {searchResults.length > 0 ? (
                        searchResults.map((user: any) => (
                          <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="flex w-full flex-col px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <span className="text-sm font-bold text-gray-900">{user.display_name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </button>
                        ))
                      ) : !isSearching ? (
                        <div className="p-4 text-center text-sm text-gray-500 italic">
                          No matching users found.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Position (e.g. Lead Developer)"
                    className="flex-1 rounded-sm border border-gray-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-teal-500 transition-all"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedUser || !position || addMemberMutation.isPending}
                    className="flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {addMemberMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                    Add Member
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {team?.members && team.members.length > 0 ? (
                team.members.map((member: TeamMember) => (
                  <div key={member.id} className="group flex items-center justify-between gap-3 rounded-sm border border-gray-50 bg-white p-2.5 text-sm shadow-sm hover:border-teal-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon size={18} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{member.name || "Unnamed Member"}</p>
                        {editingMemberId === member.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              className="w-full rounded-sm border border-teal-200 px-2 py-1 text-xs outline-none focus:border-teal-500"
                              value={editingPosition}
                              onChange={(e) => setEditingPosition(e.target.value)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateMember(member.id)}
                              disabled={updateMemberMutation.isPending}
                              className="text-teal-600 hover:text-teal-700"
                            >
                              {updateMemberMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                            </button>
                            <button
                              onClick={() => setEditingMemberId(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">{member.position}</p>
                        )}
                      </div>
                    </div>
                    
                    {editingMemberId !== member.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingMemberId(member.id);
                            setEditingPosition(member.position);
                          }}
                          className="p-1.5 text-gray-300 hover:text-teal-500 transition-colors"
                          title="Edit position"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removeMemberMutation.isPending}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          {removeMemberMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-xs text-gray-400 italic bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                  No members listed for this team yet.
                </p>
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
      )}
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
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isConfirming={isDeleting}
      title="Delete Team"
      confirmLabel="Confirm Delete"
      description={
        <>
          <p className="text-sm font-bold text-red-900">Warning: Dangerous Action</p>
          <p className="mt-1">
            Are you sure you want to delete <span className="font-bold underline">"{itemName}"</span>? This action is permanent and cannot be undone.
          </p>
        </>
      }
    />
  );
}
