"use client";

import { useState, useEffect } from "react";
import { useGetMemberByEmail, useUpdateMember } from "@/features/members";
import { useMe } from "../hooks";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Skeleton } from "./ui/Skeleton";
import { toast } from "react-toastify";

export const ProfileSection = () => {
  const { data: user } = useMe();
  const { data: member, isLoading, error } = useGetMemberByEmail(user?.email);
  const { mutateAsync: updateMember, isPending: isUpdating } = useUpdateMember();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState(""); 
  const [technicalSkills, setTechnicalSkills] = useState("");
  const [learningInterests, setLearningInterests] = useState("");
  const [tools, setTools] = useState("");

  useEffect(() => {
    if (member) {
      setBio(member.bio || "");
      setGithubUrl(member.githubUrl || "");
      setLinkedinUrl(member.linkedinUrl || ""); 
      setTechnicalSkills(member.technicalSkills?.join(", ") || "");
      setLearningInterests(member.learningInterests?.join(", ") || "");
      setTools(member.toolsAndTechnologies?.join(", ") || "");
    }
  }, [member]);

  if (isLoading) return <Skeleton className="w-full h-[300px]" />;
  if (error) return <div className="text-red-500 p-4 border border-red-500 rounded">Failed to load member</div>;
  if (!member) return null;

  const handleSave = async () => {
    try {
      await updateMember({
        gdgId: member.gdgId,
        data: {
          bio,
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null, 
          technicalSkills: technicalSkills.split(",").map(s => s.trim()).filter(Boolean),
          learningInterests: learningInterests.split(",").map(s => s.trim()).filter(Boolean),
          toolsAndTechnologies: tools.split(",").map(s => s.trim()).filter(Boolean),
        }
      });
      toast.success("Member updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update member");
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Member</CardTitle>
          <CardDescription>Update your professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div> 
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technical Skills (comma separated)</label>
            <Input value={technicalSkills} onChange={(e) => setTechnicalSkills(e.target.value)} placeholder="React, TypeScript, Node.js" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Interests (comma separated)</label>
            <Input value={learningInterests} onChange={(e) => setLearningInterests(e.target.value)} placeholder="Go, Rust, AI/ML" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tools & Technologies (comma separated)</label>
            <Input value={tools} onChange={(e) => setTools(e.target.value)} placeholder="Docker, Git, VS Code" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Professional Member</CardTitle>
          <CardDescription>Skills, Interests, and Social Links</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {member.bio && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
            <p className="text-sm leading-relaxed">{member.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">Skills & Interests</h4>
            
            {member.technicalSkills?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-gray-400">Technical Skills</p>
                <div className="flex flex-wrap gap-1">
                  {member.technicalSkills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.learningInterests?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-gray-400">Learning Interests</p>
                <div className="flex flex-wrap gap-1">
                  {member.learningInterests.map(interest => (
                    <span key={interest} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">Social Links</h4>
            <div className="grid grid-cols-1 gap-2">
              {member.githubUrl && (
                <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <span>GitHub</span>
                </a>
              )}
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <span>LinkedIn</span>
                </a>
              )} 
              {(!member.githubUrl && !member.linkedinUrl  ) && (
                <p className="text-sm text-gray-400 italic">No social links added</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
