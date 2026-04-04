import React from 'react';
import { Input, Stack } from "@packages/spark-ui";
import { FormState } from "../types";

type LinksAndSkillsFieldsProps = {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
};

export function LinksAndSkillsFields({ form, updateField }: LinksAndSkillsFieldsProps) {
  return (
    <Stack gap="xl" className="sm:grid sm:grid-cols-2">
      <div className="sm:col-span-1 space-y-2">
        <label className="text-sm font-medium text-zinc-300">GitHub URL</label>
        <Input
          value={form.githubUrl}
          onChange={(event) => updateField("githubUrl", event.target.value)}
          placeholder="e.g. https://github.com/johndoe"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-1 space-y-2">
        <label className="text-sm font-medium text-zinc-300">LinkedIn URL</label>
        <Input
          value={form.linkedinUrl}
          onChange={(event) => updateField("linkedinUrl", event.target.value)}
          placeholder="e.g. https://linkedin.com/in/johndoe"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Personal Portfolio Website URL</label>
        <Input
          value={form.portfolioWebsiteUrl}
          onChange={(event) => updateField("portfolioWebsiteUrl", event.target.value)}
          placeholder="e.g. https://johndoe.dev"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Core Technical Skills (comma-separated)</label>
        <Input
          value={form.technicalSkills}
          onChange={(event) => updateField("technicalSkills", event.target.value)}
          placeholder="e.g. React, Node.js, Python, TypeScript"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Learning Interests (comma-separated)</label>
        <Input
          value={form.learningInterests}
          onChange={(event) => updateField("learningInterests", event.target.value)}
          placeholder="e.g. Machine Learning, Web3, System Design"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Other Tools and Technologies (comma-separated)</label>
        <Input
          value={form.toolsAndTechnologies}
          onChange={(event) => updateField("toolsAndTechnologies", event.target.value)}
          placeholder="e.g. Docker, Figma, AWS, Git"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Other Links (comma-separated URLs)</label>
        <Input
          value={form.otherLinks}
          onChange={(event) => updateField("otherLinks", event.target.value)}
          placeholder="e.g. https://medium.com/@johndoe, https://dribbble.com/johndoe"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
    </Stack>
  );
}
