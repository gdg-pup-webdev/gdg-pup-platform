"use client";

import { useState, useEffect } from "react";
import { useGetPortfolioByEmail, useUpdatePortfolio } from "@/features/portfolios";
import { useMe } from "../hooks";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-toastify";

export const PortfolioSection = () => {
  const { data: user } = useMe();
  const { data: portfolio, isLoading, error } = useGetPortfolioByEmail(user?.email);
  const { mutateAsync: updatePortfolio, isPending: isUpdating } = useUpdatePortfolio();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState("");
  const [learningInterests, setLearningInterests] = useState("");
  const [tools, setTools] = useState("");

  useEffect(() => {
    if (portfolio) {
      setBio(portfolio.bio || "");
      setGithubUrl(portfolio.github_url || "");
      setLinkedinUrl(portfolio.linkedin_url || "");
      setPortfolioUrl(portfolio.portfolio_website_url || "");
      setTechnicalSkills(portfolio.technical_skills?.join(", ") || "");
      setLearningInterests(portfolio.learning_interests?.join(", ") || "");
      setTools(portfolio.tools_and_technologies?.join(", ") || "");
    }
  }, [portfolio]);

  if (isLoading) return <Skeleton className="w-full h-[300px]" />;
  if (error) return <div className="text-red-500 p-4 border border-red-500 rounded">Failed to load portfolio</div>;
  if (!portfolio) return null;

  const handleSave = async () => {
    try {
      await updatePortfolio({
        portfolioId: portfolio.id,
        data: {
          bio,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          portfolio_website_url: portfolioUrl || null,
          technical_skills: technicalSkills.split(",").map(s => s.trim()).filter(Boolean),
          learning_interests: learningInterests.split(",").map(s => s.trim()).filter(Boolean),
          tools_and_technologies: tools.split(",").map(s => s.trim()).filter(Boolean),
        }
      });
      toast.success("Portfolio updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update portfolio");
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Portfolio</CardTitle>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio URL</label>
              <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://..." />
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
          <CardTitle>Professional Portfolio</CardTitle>
          <CardDescription>Skills, Interests, and Social Links</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {portfolio.bio && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
            <p className="text-sm leading-relaxed">{portfolio.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">Skills & Interests</h4>
            
            {portfolio.technical_skills?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-gray-400">Technical Skills</p>
                <div className="flex flex-wrap gap-1">
                  {portfolio.technical_skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {portfolio.learning_interests?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-gray-400">Learning Interests</p>
                <div className="flex flex-wrap gap-1">
                  {portfolio.learning_interests.map(interest => (
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
              {portfolio.github_url && (
                <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <span>GitHub</span>
                </a>
              )}
              {portfolio.linkedin_url && (
                <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <span>LinkedIn</span>
                </a>
              )}
              {portfolio.portfolio_website_url && (
                <a href={portfolio.portfolio_website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <span>Portfolio Website</span>
                </a>
              )}
              {(!portfolio.github_url && !portfolio.linkedin_url && !portfolio.portfolio_website_url) && (
                <p className="text-sm text-gray-400 italic">No social links added</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
