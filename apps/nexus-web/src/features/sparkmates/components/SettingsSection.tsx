import { AccountSettingsSection } from "./AccountSettingsSection";

export function SettingsSection() {
  return (
    <div className="min-h-screen bg-[#010B1D] px-4 sm:px-6 pb-24 pt-24 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-zinc-400 mb-8 border-b border-white/10 pb-6 text-sm sm:text-base">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p>
        <AccountSettingsSection />
      </div>
    </div>
  );
}
