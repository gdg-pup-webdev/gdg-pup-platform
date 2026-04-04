import React from 'react';
import { Input, Stack } from "@packages/spark-ui";
import { FormState } from "../types";

type LinksAndSkillsFieldsProps = {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
};

export function LinksAndSkillsFields({ form, updateField }: LinksAndSkillsFieldsProps) {
  return (
    <Stack gap="md" className="sm:grid sm:grid-cols-2">
      <Input
        value={form.githubUrl}
        onChange={(event) => updateField("githubUrl", event.target.value)}
        placeholder="GitHub URL"
        containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
        className="text-white! py-3"
      />
      <Input
        value={form.linkedinUrl}
        onChange={(event) => updateField("linkedinUrl", event.target.value)}
        placeholder="LinkedIn URL"
        containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
        className="text-white! py-3"
      />
      <div className="sm:col-span-2">
        <Input
          value={form.portfolioWebsiteUrl}
          onChange={(event) => updateField("portfolioWebsiteUrl", event.target.value)}
          placeholder="Personal Portfolio Website URL"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          value={form.technicalSkills}
          onChange={(event) => updateField("technicalSkills", event.target.value)}
          placeholder="Core Technical Skills (comma-separated: React, Node.js, Python...)"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          value={form.learningInterests}
          onChange={(event) => updateField("learningInterests", event.target.value)}
          placeholder="Learning Interests (comma-separated: Machine Learning, Web3...)"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          value={form.toolsAndTechnologies}
          onChange={(event) => updateField("toolsAndTechnologies", event.target.value)}
          placeholder="Other Tools and Technologies (comma-separated: Docker, Figma, AWS...)"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          value={form.otherLinks}
          onChange={(event) => updateField("otherLinks", event.target.value)}
          placeholder="Other Links (comma-separated URLs)"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
    </Stack>
  );
}
