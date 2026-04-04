import React from 'react';
import { Radio } from "@packages/spark-ui";
import { FormState } from "../types";

type ProfileVisibilityFieldProps = {
  form: FormState;
  updateField: (field: keyof FormState, value: string | boolean | null) => void;
};

export function ProfileVisibilityField({ form, updateField }: ProfileVisibilityFieldProps) {
  return (
    <div className="flex flex-col space-y-6 max-w-2xl mx-auto w-full">
      <div className="space-y-4 text-center mb-4">
        <h3 className="text-xl font-semibold text-white">Profile Visibility</h3>
        <p className="text-zinc-400 text-sm">
          Do you want your profile to be discoverable by others in the Sparkmates directory? 
          You can change this anytime later.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label 
          className={`flex flex-col space-y-2 cursor-pointer p-6 rounded-2xl border transition-all ${
            form.isPublic === true 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700'
          }`}
          onClick={() => updateField("isPublic", true)}
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-lg">Public</span>
            <Radio
              name="isPublic"
              checked={form.isPublic === true}
              onChange={() => updateField("isPublic", true)}
              className="text-white pointer-events-none"
            />
          </div>
          <p className="text-zinc-400 text-sm">
            Visible to everyone. Members can see your profile, projects, and connect with you.
          </p>
        </label>

        <label 
          className={`flex flex-col space-y-2 cursor-pointer p-6 rounded-2xl border transition-all ${
            form.isPublic === false 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700'
          }`}
          onClick={() => updateField("isPublic", false)}
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-lg">Private</span>
            <Radio
              name="isPublic"
              checked={form.isPublic === false}
              onChange={() => updateField("isPublic", false)}
              className="text-white pointer-events-none"
            />
          </div>
          <p className="text-zinc-400 text-sm">
            Hidden from directory. Only you can view your profile and manage your projects.
          </p>
        </label>
      </div>

      {form.isPublic === null && (
        <p className="text-sm text-red-400/90 text-center font-medium mt-4">
          Please select a visibility option to complete your profile.
        </p>
      )}
    </div>
  );
}
