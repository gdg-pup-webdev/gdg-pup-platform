import React from 'react';
import { Input } from "@packages/spark-ui";
import { FormState } from "../types";

type BasicInfoFieldsProps = {
  form: FormState;
  updateField: (field: keyof FormState, value: string | boolean | null) => void;
};

export function BasicInfoFields({ form, updateField }: BasicInfoFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-xs text-zinc-400">
        Year level, department, and program are prefilled from your GDG member profile.
      </div>
      <div className="sm:col-span-1 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Nickname</label>
        <Input
          value={form.nickname}
          onChange={(event) => updateField("nickname", event.target.value)}
          placeholder="e.g. John"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-1 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Year Level</label>
        <Input
          type="number"
          min={1}
          max={6}
          value={form.yearLevel}
          onChange={(event) => updateField("yearLevel", event.target.value)}
          placeholder="e.g. 3"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Department</label>
        <Input
          value={form.department}
          onChange={(event) => updateField("department", event.target.value)}
          placeholder="e.g. College of Computer and Information Sciences"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Program</label>
        <Input
          value={form.program}
          onChange={(event) => updateField("program", event.target.value)}
          placeholder="e.g. Bachelor of Science in Information Technology"
          containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
          className="text-white! py-3"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <label className="text-sm font-medium text-zinc-300">Bio</label>
        <textarea
          value={form.bio}
          onChange={(event) => updateField("bio", event.target.value)}
          placeholder="e.g. Passionate full-stack developer eager to build scalable systems."
          rows={4}
          className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 text-zinc-200 outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-600 focus:border-blue-500/50 focus:bg-zinc-900/80 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
}
