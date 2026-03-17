"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, Users, Plus, Trash2, Search, UserPlus, Edit2, Check } from "lucide-react";
import { Team, TeamInsert, TeamUpdate, TeamMember } from "../types";
import { useAddTeamMember, useRemoveTeamMember, useUpdateTeamMember, useUsers, useTeam } from "../api/teams";
import { toast } from "react-toastify";

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
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Team" : "Create New Team"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Team Name</label>
          <input
            required
            type="text"
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="e.g. Web Development Team"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Briefly describe what this team does..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Responsibilities</label>
          <textarea
            rows={4}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="List the key responsibilities (one per line)..."
            value={formData.responsibilities || ""}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
          />
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
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Team"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ==========================================
// Team Details Modal (View & Manage Members)
// ==========================================
interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamDetailsModal({ isOpen, onClose, team: initialTeam }: TeamDetailsModalProps) {
  const { data: teamResponse, isLoading: isLoadingTeam } = useTeam(initialTeam?.id || "");
  const team = teamResponse?.body?.data || initialTeam;

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [position, setPosition] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState("");

  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers(1, 100);
  const addMemberMutation = useAddTeamMember();
  const removeMemberMutation = useRemoveTeamMember();
  const updateMemberMutation = useUpdateTeamMember();

  if (!initialTeam) return null;

  const users = usersResponse?.body?.data || [];
  const filteredUsers = searchQuery.length > 0 
    ? users.filter((user: any) => 
        (user.first_name + " " + user.last_name + " " + user.email).toLowerCase().includes(searchQuery.toLowerCase()) &&
        !team?.members?.some((m: TeamMember) => m.user_id === user.id)
      ) 
    : [];

  const handleAddMember = async () => {
    console.log("selectedUser", selectedUser);
    console.log("position", position);
    console.log("team", team);
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

  const handleStartEdit = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setEditingPosition(member.position);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Details & Management">
      {isLoadingTeam && !team ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="space-y-6">
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
                onClick={() => setIsAddingMember(!isAddingMember)}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                {isAddingMember ? <X size={14} /> : <Plus size={14} />}
                {isAddingMember ? "Cancel" : "Add Member"}
              </button>
            </div>

            {isAddingMember && (
              <div className="mb-6 space-y-4 rounded-sm border border-teal-100 bg-teal-50/30 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name..."
                    className="w-full rounded-sm border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm outline-none focus:border-teal-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {searchQuery && filteredUsers.length > 0 && !selectedUser && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-lg">
                      {filteredUsers.map((user: any) => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          {user.first_name} {user.last_name} ({user.email})
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchQuery && filteredUsers.length === 0 && !selectedUser && !isLoadingUsers && (
                    <div className="absolute z-10 mt-1 w-full rounded-sm border border-gray-100 bg-white p-3 text-center text-xs text-gray-500 shadow-lg">
                      No users found matching your search.
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div className="flex items-center justify-between rounded-sm bg-white p-2 border border-teal-200">
                    <div className="text-sm">
                      <span className="font-bold text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</span>
                      <span className="ml-2 text-xs text-gray-500">{selectedUser.email}</span>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Position (e.g. Lead Developer)"
                    className="flex-1 rounded-sm border border-gray-200 bg-white py-2 px-3 text-sm outline-none focus:border-teal-500"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedUser || !position || addMemberMutation.isPending}
                    className="flex items-center gap-2 rounded-sm bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    {addMemberMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {team?.members && team.members.length > 0 ? (
                team.members.map((member: TeamMember) => (
                  <div key={member.id} className="group flex items-center justify-between gap-3 rounded-sm border border-gray-50 bg-white p-2.5 text-sm shadow-sm hover:border-teal-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <Users size={16} />
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
                          onClick={() => handleStartEdit(member)}
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team">
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
